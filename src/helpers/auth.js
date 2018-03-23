import { db, firebaseAuth } from "../config";

const provider = new firebaseAuth.GoogleAuthProvider();

export function googleSignIn() {
  firebaseAuth().signInWithRedirect(provider);
}

firebaseAuth().onAuthStateChanged(user => {
  if (user) {
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
