import {getRoom} from "./firebasseRepo.js"
import {alertRoom} from "./index.js"

const listContainer = document.getElementById("RoomsList")

export default function createCard(room, place){
    let roomCard = document.createElement("room_card");
    roomCard.classList = "roomCard"
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
    var place_text = document.createElement("rcPlace");
    place_text.classList.add("roomCard__place");
    place_text.textContent = place;
    roomCard.appendChild(place_text);
  }
  
  function addNumberText(number, roomCard) {
    var numberText = document.createElement("rcNumber");
    numberText.classList.add("roomCard__title");
    numberText.textContent = number;
    roomCard.appendChild(numberText);
  }
  
  function addPointsText(points, roomCard) {
    var pointsText = document.createElement("rcPoints");
    pointsText.classList.add("roomCard__points");
    pointsText.textContent = points;
    roomCard.appendChild(pointsText);
  }
  
  function addGradeText(grade, roomCard) {
    var circle = document.createElement("gradeCircle");
    circle.classList.add("roomCard__circle");
    circle.textContent = grade;
    roomCard.appendChild(circle);
  }
  