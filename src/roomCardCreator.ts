import {getRoom} from "./firebaseRepo"
import {alertRoom, Room} from "./index"

const gradeToColor = new Map<number, string>([
  [5, "#d21717"],
  [6, "#74d217"],
  [7, "#17d2d2"],
  [8, "#7417d2"],
])
const listContainer = document.getElementById("RoomsList")!

export default function createCard(room: Room, place: number){
    let roomCard = document.createElement("room_card") ;
    roomCard.classList.add("roomCard")
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

function addPlaceText(place: number, roomCard: HTMLElement) {
    var place_text = document.createElement("rcPlace");
    place_text.classList.add("roomCard__place");
    place_text.textContent = place.toString();
    roomCard.appendChild(place_text);
}

function addNumberText(number: number, roomCard: HTMLElement) {
  let numberText = document.createElement("rcNumber");
  numberText.classList.add("roomCard__title");
  numberText.textContent = number.toString();
  roomCard.appendChild(numberText);
}

function addPointsText(points: number, roomCard: HTMLElement) {
  let pointsText = document.createElement("rcPoints");
  pointsText.classList.add("roomCard__points");
  pointsText.textContent = points.toString();
  roomCard.appendChild(pointsText);
}

function addGradeText(grade: number, roomCard: HTMLElement) {
  let circle = document.createElement("gradeCircle");
  circle.classList.add("roomCard__circle");
  circle.textContent = grade.toString();
  circle.style.backgroundColor = gradeToColor.get(grade)!
  roomCard.appendChild(circle);
}
