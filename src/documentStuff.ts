import { Room } from "./index"
import { DataSnapshot } from 'firebase/database';


let rooms: Room[] = []
const gradeCheckers: Element[] = Array
.from(
    document.getElementsByClassName("gradeChecker")
)
const gradeCheckersContainer: HTMLElement =
document.getElementById("gradeCheckers")!
const listSwitchInput =
document.getElementById("listSwitchInput") as HTMLInputElement
const findRoomBtn =
document.getElementById("FindRoomBtn")!
const roomTextField =
document.getElementById("roomTextField") as HTMLInputElement
const listContainer =
document.getElementById("RoomsList")!
const roomsAndFilters =
document.getElementById("roomsAndFilters")!
const dialog =
document.querySelector("dialog")!;
const listSwitch =
document.getElementById("listSwitch")!
const userRoomCard = document.getElementById("userRoom")!
const userRoomTextField = document.getElementById("userRoomTextField") as HTMLInputElement
const userRoomBtn = document.getElementById("userRoomBtn")!
const gradeToColor = new Map<number, string>([
    [5, "#d21717"],
    [6, "#74d217"],
    [7, "#17d2d2"],
    [8, "#7417d2"],
])
const gradeToString = new Map<number, string>([
    [5, "חמישית"],
    [6, "שישית"],
    [7, "שביעית"],
    [8, "שמינית"],
])

function removeAllChildNodes(parent: HTMLElement) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function getIconHtml(name: string, type: string = "solid"){
    return `<i class="fa-${type} fa-${name}"></i>`
}
function onListDisplayToggle(){
    listContainer.classList.toggle("listDisplay")
    gradeCheckersContainer.classList.toggle("listDisplay")
    roomsAndFilters.classList.toggle("listDisplay")
}
export function alertRoom(room: Room | undefined){
  if (room === undefined){
    alert("החדר לא קיים!")
    return
  }
  const place = rooms.indexOf(room) + 1
  dialog.showModal();
  dialog.onclick = (event) => {
    if (event.target == dialog) {
      event.preventDefault();
      dialog.close();
    }
  }
  dialog.firstElementChild!.children[0].innerHTML =
    `חדר ${room.number}`
  dialog.firstElementChild!.children[1].innerHTML =
  `ניקוד: ${room.points} ${getIconHtml("star")}`
  dialog.firstElementChild!.children[2].innerHTML =
    `שכבה: ${gradeToString.get(room.grade)} ${getIconHtml("layer-group")}`
  dialog.firstElementChild!.children[3].innerHTML =
    `חברי החדר: ${room.members} ${getIconHtml("user-group")}`
  dialog.firstElementChild!.children[4].innerHTML =
    `מיקום: ${place} ${getIconHtml("ranking-star")}`
}

export function updateRoomList(dbSnapshot: DataSnapshot){
    rooms = []
    dbSnapshot.forEach(roomSnapshot => {
      const room: Room = {
        grade: roomSnapshot.child("grade").val(),
        number: roomSnapshot.child("number").val(),
        points: roomSnapshot.child("totalPoints").val(),
        members: roomSnapshot.child("members").val()
      }
      rooms.push(room)
    });
    updateRoomListWithRooms(rooms)
}
function updateUserRoomCard(){
  const userRoomNumber = localStorage.getItem("userRoomNumber")
  if (userRoomNumber != null){
    const userRoom = findRoom(parseInt(userRoomNumber))
    if (userRoom !== undefined){
      if(userRoomCard.parentElement!.children.length > 1)  userRoomCard.parentElement!.removeChild(userRoomCard.parentElement!.children[1])
      userRoomTextField.placeholder = "שנה חדר"
      userRoomCard.style.display = "flex"
      userRoomCard.onclick = () => {alertRoom(userRoom)}
      userRoomCard.ariaLabel = `חדר ${userRoom.number}`
      userRoomCard.title = `חדר ${userRoom.number}`

      userRoomCard.children[0].innerHTML = (rooms.indexOf(userRoom) + 1).toString()
      userRoomCard.children[1].innerHTML = userRoom.grade.toString();
      (userRoomCard.children[1] as HTMLElement)!.style.backgroundColor = gradeToColor.get(userRoom.grade)!;
      userRoomCard.children[2].innerHTML = userRoom.number.toString()
      userRoomCard.children[3].innerHTML = userRoom.points.toString()
    } else {
      const roomErrorTxt = document.createElement("div")
      roomErrorTxt.innerHTML =  "אירעה שגיאה בטעינת החדר שלך, אנא נסה לקבוע מספר חדר חדש"
      roomErrorTxt.style.alignSelf = "center"
      roomErrorTxt.style.textAlign = "center"
      userRoomCard.parentElement!.appendChild(roomErrorTxt)
    }
  } else {
    const noRoomSelected = document.createElement("div")
    noRoomSelected.innerHTML =  "לא קבעת חדר"
    noRoomSelected.style.alignSelf = "center"
    noRoomSelected.style.textAlign = "center"
    userRoomCard.parentElement!.appendChild(noRoomSelected)
  }
}
function addDummyRooms(){
  rooms.forEach(room => {
    if (room.members == "a") rooms.splice(rooms.indexOf(room), 1)
  });
  let i = 0
  const times = Math.floor(Math.random() * (30 - 15) + 15)
  for (i;i < times;i++){
      const roomNumber = Math.floor(Math.random() * (5050 - 110) + 110)
      const roomPoints = Math.floor(Math.random() * (130 -(-20)) + (-20))
      const roomGrade = Math.floor(Math.random() * (9 - 5) + 5)
      rooms.push(
          {
              number: roomNumber,
              points: roomPoints,
              grade: roomGrade,
              members : "a"
          }
      )
  }
}
function updateRoomListWithRooms(rooms: Array<Room>){
  /*
  REMOVE THIS AFTER TESTING
  */
  addDummyRooms()
 //  ^^^^^^^^^^^^^^^

  removeAllChildNodes(listContainer)
  //Sorting the rooms by points
  rooms = rooms.sort((a, b) => a.points < b.points ? 1 : -1)
  //Filtering grade to display
  rooms
  .filter(room => getSelectedGrades().includes(room.grade))
  .forEach(function(room, place){
    createCard(room, place)
  })

  updateUserRoomCard()
}
function getSelectedGrades(): Array<Number>{
    if (
      (gradeCheckers[0].firstElementChild as HTMLInputElement)
      .checked
      ){
      return [5, 6, 7, 8]
    }

    let count: Array<Number> = []
    gradeCheckers.forEach(gradeChecker => {
      if (
        (gradeChecker.firstElementChild as HTMLInputElement)
        .checked
      ){
        count.push(
          parseInt(gradeChecker.getAttribute("grade")!)
        )
      }
    });
    return count
}
function onGradeCheckerClick(gradeChecker: Element){
    let isChecked = (gradeChecker.firstElementChild! as HTMLInputElement).checked
    //Returning if there's only one checked
    const isOnlyOneGradeCheckerSelected = gradeCheckers
    .filter(
      gc =>
      (gc.firstElementChild! as HTMLInputElement).checked
    ).length == 1

    if (isChecked && isOnlyOneGradeCheckerSelected) return
    //toggling checked
    (gradeChecker.firstElementChild! as HTMLInputElement).checked
      = !(gradeChecker.firstElementChild! as HTMLInputElement).checked
    //All - others
    if (gradeChecker == gradeCheckers[0]){
      gradeCheckers
      .slice(1, 5)
      .forEach(otherChecker => {
        (otherChecker.firstElementChild as HTMLInputElement)
        .checked = false
      });
    } else {
      (gradeCheckers[0].firstElementChild as HTMLInputElement)
      .checked = false
    }

    updateRoomListWithRooms(rooms)
}
function createCard(room: Room, place: number){
    let roomCard = document.createElement("room_card") ;
    roomCard.classList.add("roomCard")
    roomCard.onclick = () => {
        alertRoom(room)
    }
    roomCard.ariaLabel = `חדר ${room.number}`
    roomCard.title = `חדר ${room.number}`

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
function findRoom(roomNumber: number): Room | undefined{
  const isNumbersEqual = (r: Room) => r.number == roomNumber
  return rooms.find(isNumbersEqual)
}

listSwitchInput.onclick = onListDisplayToggle
findRoomBtn.onclick = () => {
    if(roomTextField.value != ""){
        alertRoom(findRoom(parseInt(roomTextField.value)))
        roomTextField.value = ""
    }
}
listSwitch.onclick = () => {
    onListDisplayToggle()
    listSwitchInput.checked = !listSwitchInput.checked
}
gradeCheckers.forEach(gradeChecker => {
    gradeChecker.addEventListener(
      'click', ()=> {
        onGradeCheckerClick(gradeChecker)
        }
    )
});
userRoomBtn.onclick = () => {
  const userInput = userRoomTextField.value
  userRoomTextField.value = ""
  if (userInput == ""){
    return
  }
  const roomEntered = findRoom(parseInt(userInput))
  if (roomEntered === undefined){
    alert("החדר לא קיים!")
    return
  }
  localStorage.setItem("userRoomNumber", userInput)
  updateUserRoomCard()
}