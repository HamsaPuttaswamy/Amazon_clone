// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDHEw2M5e_jlop-ic61PhoF6_SZiVyNq9g",
    authDomain: "clone-23-46b2b.firebaseapp.com",
    projectId: "clone-23-46b2b",
    storageBucket: "clone-23-46b2b.appspot.com",
    messagingSenderId: "968722497896",
    appId: "1:968722497896:web:426450188d0bcc916916dd",
    measurementId: "G-PKSZVX33HK"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export {db,auth};