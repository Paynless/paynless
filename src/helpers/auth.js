import { db, firebaseAuth } from "../config";

const provider = new firebaseAuth.GoogleAuthProvider();

export function googleSignIn() {
  firebaseAuth().signInWithRedirect(provider);
}

firebaseAuth().onAuthStateChanged(user => {
  if (user) {
    db
      .collection("users")
      .where("uid", "==", user.uid)
      .get()
      .then(foundUser => {
        if (!foundUser.docs.length) {
          return db
            .collection("users")
            .add({
              email: user.email,
              uid: user.uid
            })
            .then(docRef => docRef)
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
        }
      });
  }
});

export const saveUser = async (user, firstName, lastName) => {
  try {
    const data = {
      email: user.email,
      uid: user.uid,
      firstName: firstName,
      lastName: lastName,
      favorites: ""
    };
    const userRef = await db.collection("users").doc();
    data.id = userRef.id;
    return userRef.set(data);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const auth = async (email, pw, firstName, lastName) => {
  const user = await firebaseAuth().createUserWithEmailAndPassword(email, pw);
  saveUser(user, firstName, lastName);
};

export function logout() {
  return firebaseAuth().signOut();
}

export function login(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function resetPassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email);
}
