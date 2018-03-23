import { db, firebaseAuth } from "../config";

const provider = new firebaseAuth.GoogleAuthProvider();

export function googleSignIn() {
  firebaseAuth().signInWithRedirect(provider);
}

firebaseAuth()
  .getRedirectResult()
  .then(result => {
    if (result.credential) {
      const token = result.credential.accessToken;
    }

    const User = {
      uid: result.user.uid,
      email: result.user.email
    };

    firebaseAuth()
      .collection("users")
      .doc()
      .set(User, { merge: true })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = error.credential;
      });
  });

export function auth(email, pw) {
  return firebaseAuth()
    .createUserWithEmailAndPassword(email, pw)
    .then(saveUser);
}

export function logout() {
  return firebaseAuth().signOut();
}

export function login(email, pw) {
  return firebaseAuth().signInWithEmailAndPassword(email, pw);
}

export function resetPassword(email) {
  return firebaseAuth().sendPasswordResetEmail(email);
}

export function saveUser(user) {
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
