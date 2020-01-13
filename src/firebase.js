import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCVRxXm5EXKYF0SWLUlZNGNINBqgJm59wk",
  authDomain: "zpotizpiez.firebaseapp.com",
  databaseURL: "https://zpotizpiez.firebaseio.com",
  projectId: "zpotizpiez",
  storageBucket: "zpotizpiez.appspot.com",
  messagingSenderId: "146222850402",
  appId: "1:146222850402:web:fab04d0057098c3ac84c3b",
  measurementId: "G-CZPCCCEBZP"
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();

export { firebase };
