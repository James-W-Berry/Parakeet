import firebase from 'firebase';


var firebaseConfig = {
    apiKey: "AIzaSyCVRxXm5EXKYF0SWLUlZNGNINBqgJm59wk",
    authDomain: "zpotizpiez.firebaseapp.com",
    databaseURL: "https://zpotizpiez.firebaseio.com",
    projectId: "zpotizpiez",
    storageBucket: "zpotizpiez.appspot.com",
    messagingSenderId: "146222850402",
    appId: "1:146222850402:web:4d813e574954c093c84c3b",
    measurementId: "G-CEN81PQXRX"
};


firebase.initializeApp(firebaseConfig);

firebase.firestore();

export {firebase};
