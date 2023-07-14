import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import {Room} from "./index.js"

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

export function getRoom(number, onGet){
      get(child(roomsRef, number)).then((snapshot) => {
        if (snapshot.exists()) {
          let room = new Room(
            snapshot.child("grade").val(),
            snapshot.child("number").val(),
            snapshot.child("totalPoints").val(),
            snapshot.child("members").val()
          )
          onGet(room)
        } else {
          alert('This room not exsits!');
        }
      }).catch((error) => {
        console.error(error);
      });
}
  
export function onRoomChange(doOnChange){
  onValue(roomsRef, (snapshot) => {
    doOnChange(snapshot)
  })
}