import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyAo-TdgxPHOPW1lOh3pZt1GP5SP3JZBTBY",
    authDomain: "kusiaga-165202.firebaseapp.com",
    databaseURL: "https://kusiaga-165202.firebaseio.com",
    projectId: "kusiaga-165202",
    storageBucket: "kusiaga-165202.appspot.com",
    messagingSenderId: "964118721025"

  };

 const firebaseApp = firebase.initializeApp(firebaseConfig) ;
 export default firebaseApp;