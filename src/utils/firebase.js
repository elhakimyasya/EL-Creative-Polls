import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBCl_Bof8W2baR1-6mC5QOKQe06UfPwTNk",
    authDomain: "polls-66eef.firebaseapp.com",
    databaseURL: "https://polls-66eef.firebaseio.com",
    storageBucket: "polls-66eef.appspot.com",
};

export const firebaseApp = firebase.initializeApp(config);
