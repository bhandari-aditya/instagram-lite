import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAwG91FD0H9zcNzlfTra-1NCXAERgXGxAc",
    authDomain: "instagram-clone-24169.firebaseapp.com",
    projectId: "instagram-clone-24169",
    storageBucket: "instagram-clone-24169.appspot.com",
    messagingSenderId: "1001414528022",
    appId: "1:1001414528022:web:004b856c0d1b9049c5f937",
    measurementId: "G-YQP9MSCZN5",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
