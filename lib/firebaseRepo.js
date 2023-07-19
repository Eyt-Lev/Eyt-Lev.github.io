"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRoomChange = exports.getRoom = void 0;
var app_1 = require("firebase/app");
var database_1 = require("firebase/database");
var firebaseConfig = {
    apiKey: "AIzaSyC1UC_xroJ8P9sHvzeOCafXaehGRI77-_E",
    authDomain: "appchi-langs.firebaseapp.com",
    databaseURL: "https://appchi-langs-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "appchi-langs",
    storageBucket: "appchi-langs.appspot.com",
    messagingSenderId: "777461601601",
    appId: "1:777461601601:web:6c8befab32e3fd2f127dc0",
    measurementId: "G-16PWJMNJWG"
};
var app = (0, app_1.initializeApp)(firebaseConfig);
var database = (0, database_1.getDatabase)(app);
var roomsRef = (0, database_1.ref)(database, "Rooms");
function getRoom(number, onGet) {
    (0, database_1.get)((0, database_1.child)(roomsRef, number)).then(function (snapshot) {
        if (snapshot.exists()) {
            var room = {
                grade: snapshot.child("grade").val(),
                number: snapshot.child("number").val(),
                points: snapshot.child("totalPoints").val(),
                members: snapshot.child("members").val()
            };
            onGet(room);
        }
        else {
            alert('This room does not exists!');
        }
    }).catch(function (error) {
        console.error(error);
    });
}
exports.getRoom = getRoom;
function onRoomChange(doOnChange) {
    (0, database_1.onValue)(roomsRef, function (snapshot) {
        doOnChange(snapshot);
    });
}
exports.onRoomChange = onRoomChange;
