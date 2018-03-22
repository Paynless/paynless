import firebase from 'firebase';
// Required for side-effects
require('firebase/firestore');

const config = {
  apiKey: 'AIzaSyC7IgI5-j77wekNYOxFd0_-FNGq3FuoOH4',
  authDomain: 'paynless-db.firebaseapp.com',
  databaseURL: 'https://paynless-db.firebaseio.com',
  projectId: 'paynless-db',
  storageBucket: 'paynless-db.appspot.com',
  messagingSenderId: '575250561701'
};

firebase.initializeApp(config);

export const db = firebase.firestore();
export const firebaseAuth = firebase.auth;
export const firestore = firebase.firestore;
