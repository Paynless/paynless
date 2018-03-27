import { db, firebaseAuth } from "../config";

const provider = new firebaseAuth.GoogleAuthProvider();

export function googleSignIn() {
  firebaseAuth().signInWithRedirect(provider);
}

firebaseAuth().onAuthStateChanged(user => {
  if (user) {
    db
      .collection("Users")
      .doc(user.uid)
      .get()
      .then(foundUser => {
        if (!foundUser) {
          const userRef = db.collection("Users").doc();
          return userRef.set({
            email: user.email,
            uid: userRef.id
          })
            .then(docRef => docRef)
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
        }
      });
  }
});

const saveUser = (user, firstName, lastName) => {
  const data = {
    email: user.email,
    uid: user.uid,
    firstName: firstName,
    lastName: lastName,
    favorites: {}
  };
  return db.collection("Users").doc(user.uid).set(data)
    .catch(error => {
      console.error("Error adding document: ", error);
    })
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
