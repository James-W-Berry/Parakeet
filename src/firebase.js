import firebase from 'firebase';


const firebaseConfig = {
  apiKey: "AIzaSyCVRxXm5EXKYF0SWLUlZNGNINBqgJm59wk",
  authDomain: "zpotizpiez.firebaseapp.com",
  databaseURL: "https://zpotizpiez.firebaseio.com",
  projectId: "zpotizpiez",
  storageBucket: "zpotizpiez.appspot.com",
  messagingSenderId: "146222850402",
  appId: "1:146222850402:web:3849cccd55b1096ec84c3b",
  measurementId: "G-FP14Y10X3P"
};


firebase.initializeApp(firebaseConfig);

firebase.firestore();

export {firebase};
