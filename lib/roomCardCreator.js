"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebaseRepo_1 = require("./firebaseRepo");
var index_1 = require("./index");
var gradeToColor = new Map([
    [5, "#d21717"],
    [6, "#74d217"],
    [7, "#17d2d2"],
    [8, "#7417d2"],
]);
var listContainer = document.getElementById("RoomsList");
function createCard(room, place) {
    var roomCard = document.createElement("room_card");
    roomCard.classList.add("roomCard");
    roomCard.addEventListener("click", function () {
        (0, firebaseRepo_1.getRoom)(room.number.toString(), index_1.alertRoom);
    });
    addPlaceText(place + 1, roomCard);
    addGradeText(room.grade, roomCard);
    addNumberText(room.number, roomCard);
    addPointsText(room.points, roomCard);
    listContainer.appendChild(roomCard);
}
exports.default = createCard;
function addPlaceText(place, roomCard) {
    var place_text = document.createElement("rcPlace");
    place_text.classList.add("roomCard__place");
    place_text.textContent = place.toString();
    roomCard.appendChild(place_text);
}
function addNumberText(number, roomCard) {
    var numberText = document.createElement("rcNumber");
    numberText.classList.add("roomCard__title");
    numberText.textContent = number.toString();
    roomCard.appendChild(numberText);
}
function addPointsText(points, roomCard) {
    var pointsText = document.createElement("rcPoints");
    pointsText.classList.add("roomCard__points");
    pointsText.textContent = points.toString();
    roomCard.appendChild(pointsText);
}
function addGradeText(grade, roomCard) {
    var circle = document.createElement("gradeCircle");
    circle.classList.add("roomCard__circle");
    circle.textContent = grade.toString();
    circle.style.backgroundColor = gradeToColor.get(grade);
    roomCard.appendChild(circle);
}
