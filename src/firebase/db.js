import firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
// import router from '@/router';
// import Vue from 'vue';
// import App from '@/App.vue';
const firebaseConfig = {
  apiKey: 'AIzaSyCvAUhTq6tjb9pLbgKvNKfXNRbPkrwH6NI',
  authDomain: 'better-to-do-6027d.firebaseapp.com',
  projectId: 'better-to-do-6027d',
  storageBucket: 'better-to-do-6027d.appspot.com',
  messagingSenderId: '561822627555',
  appId: '1:561822627555:web:5a55636e2b53e19ab377d6',
};

// const app = '';
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line no-unused-vars
const firebaseApp = firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line import/prefer-default-export
// export const db = firebase.firestore();
const firestore = firebaseApp.firestore();
firestore.settings({ timestampsInSnapshots: true });

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export default firestore;
