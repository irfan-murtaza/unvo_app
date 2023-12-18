import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "XXX",
  authDomain: "XXX",
  projectId: "XXX",
  storageBucket: "XXX",
  messagingSenderId: "XXX",
  appId: "XXX",
  measurementId: "XXX",
};

const app = firebase.initializeApp(firebaseConfig);
export { app };
