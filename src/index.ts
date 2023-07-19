import createCard from './roomCardCreator'
import {getRoom, onRoomChange} from './firebaseRepo';
import { DataSnapshot } from 'firebase/database';

const gradeCheckers: Element[] = Array.from(document.getElementsByClassName("gradeChecker"))
const gradeCheckersContainer: HTMLElement = document.getElementById("gradeCheckers")!
const listSwitchInput = document.getElementById("listSwitchInput") as HTMLInputElement
const findRoomBtn = document.getElementById("FindRoomBtn")!
const roomTextField = document.getElementById("roomTextField") as HTMLInputElement
var rooms: Room[] = []
const listContainer = document.getElementById("RoomsList")!
const roomsAndFilters = document.getElementById("roomsAndFilters")!
const dialog = document.querySelector("dialog")!;
const groupIcon = `<i class="fa-solid fa-user-group"></i>`
const gradeIcon = `<i class="fa-solid fa-layer-group"></i>`
const pointsIcon = `<i class="fa-solid fa-star"></i>`
const placeIcon = `<i class="fa-solid fa-ranking-star"></i>`

const gradeToString = new Map<number, string>([
  [5, "חמישית"],
  [6, "שישית"],
  [7, "שביעית"],
  [8, "שמינית"],
])

export function alertRoom(room: Room){
  const isNumbersEqual = (r: Room) => r.number == room.number
  const place = rooms.findIndex(isNumbersEqual) + 1
  dialog.showModal();
  dialog.onclick = function(event) {
    if (event.target == dialog) {
      event.preventDefault();
      dialog.close();
    }
  }
  dialog.firstElementChild!.children[0].innerHTML =
   `חדר ${room.number}`
  dialog.firstElementChild!.children[1].innerHTML =
  `ניקוד: ${room.points} ${pointsIcon}`
  dialog.firstElementChild!.children[2].innerHTML =
  `שכבה: ${gradeToString.get(room.grade)} ${gradeIcon}`
  dialog.firstElementChild!.children[3].innerHTML =
   `חברי החדר: ${room.members} ${groupIcon}`
  dialog.firstElementChild!.children[4].innerHTML =
   `מיקום: ${place} ${placeIcon}`
}

listSwitchInput.onclick = () => {
  onListDisplayToggle()
}

document.getElementById("listSwitch")!.onclick = () => {
  onListDisplayToggle()
  listSwitchInput.checked = !listSwitchInput.checked
}

function onListDisplayToggle(){
  listContainer.classList.toggle("listDisplay")
  gradeCheckersContainer.classList.toggle("listDisplay")
  roomsAndFilters.classList.toggle("listDisplay")
}

findRoomBtn.addEventListener(
  'click', () => {
    if(roomTextField.value != ""){
      getRoom(roomTextField.value, alertRoom)
      roomTextField.value = ""
    }
})

gradeCheckers.forEach(gradeChecker => {
  gradeChecker.addEventListener(
    'click',
     ()=> {onGradeCheckerClick(gradeChecker)}
     )
});

function onGradeCheckerClick(gradeChecker: Element){
  const isOnlyOneGradeCheckerSelected = gradeCheckers
  .filter(
    gradeChecker =>
    (gradeChecker.firstElementChild as HTMLInputElement).checked
  ).length == 1

  if (
    (gradeChecker.firstElementChild! as HTMLInputElement).checked
    && isOnlyOneGradeCheckerSelected
    ) { return }

    (gradeChecker.firstElementChild! as HTMLInputElement).checked
    = !(gradeChecker.firstElementChild! as HTMLInputElement).checked
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

onRoomChange(updateRoomList)

function updateRoomList(dbSnapshot: DataSnapshot){
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
  //Sorting the rooms by points
  rooms = rooms.sort((a, b) => a.points < b.points ? 1 : -1)

  updateRoomListWithRooms(rooms)
}

function updateRoomListWithRooms(rooms: Array<Room>){
  removeAllChildNodes(listContainer)
  rooms
  .filter(room => getSelectedGrades().includes(room.grade))
  .forEach(function(room, place){
    createCard(room, place)
  })
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

function removeAllChildNodes(parent: HTMLElement) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

export interface Room {
  grade: number
  number: number
  points: number
  members: string
}