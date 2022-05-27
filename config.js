import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAILCUnOauS_orpzLBnpBbIlWZ0DzC1U-w",
  authDomain: "todo-list-96615.firebaseapp.com",
  projectId: "todo-list-96615",
  storageBucket: "todo-list-96615.appspot.com",
  messagingSenderId: "438202165899",
  appId: "1:438202165899:web:c417461d72b56eb879428e",
  measurementId: "G-RZ38J3K6Y6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };