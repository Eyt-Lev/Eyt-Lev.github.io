import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyC1UC_xroJ8P9sHvzeOCafXaehGRI77-_E",
    authDomain: "appchi-langs.firebaseapp.com",
    databaseURL: "https://appchi-langs-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "appchi-langs",
    storageBucket: "appchi-langs.appspot.com",
    messagingSenderId: "777461601601",
    appId: "1:777461601601:web:6c8befab32e3fd2f127dc0",
    measurementId: "G-16PWJMNJWG"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const roomsRef = ref(database, "Rooms")
const analytics = getAnalytics(app);

export function onRoomChange(doOnChange: Function){
  onValue(roomsRef, (snapshot) => {
    doOnChange(snapshot)
  })
}