import {getRoom} from "./firebasseRepo.js"
import {alertRoom} from "./index.js"

const listContainer = document.getElementById("RoomsList")

export default function createCard(room, place){
    let roomCard = document.createElement("room_card");
    roomCard.classList = "info"
    roomCard.addEventListener(
      "click", () => {
        getRoom(room.number.toString(), alertRoom)
    })

    addPlaceText(place + 1, roomCard)
    addGradeText(room.grade, roomCard)
    addNumberText(room.number, roomCard)
    addPointsText(room.points, roomCard)

    listContainer.appendChild(roomCard);
}

function addPlaceText(place, roomCard) {
    var place_text = document.createElement("place_text");
    place_text.classList.add("info__place");
    place_text.textContent = place;
    roomCard.appendChild(place_text);
  }
  
  function addNumberText(number, roomCard) {
    var numberText = document.createElement("number_text");
    numberText.classList.add("info__title");
    numberText.textContent = number;
    roomCard.appendChild(numberText);
  }
  
  function addPointsText(points, roomCard) {
    var pointsText = document.createElement("info__points");
    pointsText.classList.add("info__points");
    pointsText.textContent = points;
    roomCard.appendChild(pointsText);
  }
  
  function addGradeText(grade, roomCard) {
    var circle = document.createElement("grade_circle");
    circle.classList.add("info__circle");
    circle.textContent = grade;
    roomCard.appendChild(circle);
  }
  