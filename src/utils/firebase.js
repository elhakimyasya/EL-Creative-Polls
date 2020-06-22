import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCYAMjf1YlWxQ0lBzHikORvstH_TBbiLBw",
    authDomain: "polling-d7d0f.firebaseapp.com",
    databaseURL: "https://polling-d7d0f.firebaseio.com",
  
    storageBucket: "polling-d7d0f.appspot.com",
};

export const firebaseApp = firebase.initializeApp(config);
