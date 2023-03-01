const firebase = require('firebase')

// const firebaseConfig = {
//     apiKey: "AIzaSyDf8oTALBmLiRXMi32GqaywK3a0amHT6iE",
//     authDomain: "masterslease-4144f.firebaseapp.com",
//     projectId: "masterslease-4144f",
//     storageBucket: "masterslease-4144f.appspot.com",
//     messagingSenderId: "651894172101",
//     appId: "1:651894172101:web:10112815c1f0ce4e89c3ac"
// };

const firebaseConfig = {
    apiKey: "AIzaSyAyfXhWU5-_cN9cThvo7SsFN8rLNgAwZRQ",
    authDomain: "masterlease-d6cdb.firebaseapp.com",
    projectId: "masterlease-d6cdb",
    storageBucket: "masterlease-d6cdb.appspot.com",
    messagingSenderId: "1064864427294",
    appId: "1:1064864427294:web:338f981568313d033b2d0f"
};

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()
module.exports = { firebase, db };