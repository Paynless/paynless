import { db, firebaseAuth } from '../config';

export const auth = async (email, pw, firstName, lastName, dob) => {
  const user = await firebaseAuth()
    .createUserWithEmailAndPassword(email, pw);
  saveUser(user, firstName, lastName, dob);
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

export const saveUser = async (user, firstName, lastName, dob) => {
  try {
    await db
      .collection(`users`)
      .add({
        email: user.email,
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
      })
  } catch(error) {
      console.error('Error adding document: ', error);
    }
}
