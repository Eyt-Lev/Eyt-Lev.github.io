import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import {Room} from "./index"

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

export function getRoom(number: string, onGet: Function){
      get(child(roomsRef, number)).then((snapshot) => {
        if (snapshot.exists()) {
          const room: Room = {
            grade: snapshot.child("grade").val(),
            number: snapshot.child("number").val(),
            points: snapshot.child("totalPoints").val(),
            members: snapshot.child("members").val()
          }
          onGet(room)
        } else {
          alert('This room does not exists!');
        }
      }).catch((error) => {
        console.error(error);
      });
}

export function onRoomChange(doOnChange: Function){
  onValue(roomsRef, (snapshot) => {
    doOnChange(snapshot)
  })
}