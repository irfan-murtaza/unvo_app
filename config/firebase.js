import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyDY5odWYUXksgUQOpLScVFRxfUk6gV0ZJY",
  authDomain: "unvoapp-464aa.firebaseapp.com",
  projectId: "unvoapp-464aa",
  storageBucket: "unvoapp-464aa.appspot.com",
  messagingSenderId: "923607384596",
  appId: "1:923607384596:web:b4f58fa74907f0b2c35d01",
  measurementId: "G-H6LJ1EFRF0",
};

const app = firebase.initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);
export { app };
