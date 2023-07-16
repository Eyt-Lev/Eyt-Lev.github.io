import createCard from './roomCardCreator'
import {getRoom, onRoomChange} from './firebaseRepo';
import {MDCRipple} from '@material/ripple';
import { DataSnapshot } from 'firebase/database';

MDCRipple.attachTo(
  document.querySelector('.mdc-button')!
);

const gradeCheckers: Array<Element> = Array.from(document.getElementsByClassName("gradeChecker"))
const listSwitchInput = document.getElementById("listSwitchInput") as HTMLInputElement
const findRoomBtn = document.getElementById("FindRoomBtn")!
const roomTextField = document.getElementById("roomTextField") as HTMLInputElement
var rooms: Array<Room> = []
const listContainer = document.getElementById("RoomsList")!

const gradeToString = new Map<number, string>([
  [5, "חמישית"],
  [6, "שישית"],
  [7, "שביעית"],
  [8, "שמינית"],
])

export function alertRoom(room: Room){
  alert(
    `Room ${room.number}\n` +
    `Points: ${room.points}\n` +
    `Grade: ${gradeToString.get(room.grade)!}\n` +
    `Members: ${room.members}`
  )
}

listSwitchInput.addEventListener(
  'click', () => {
    const columns = listSwitchInput.checked ? "1" : "auto-fit"
    listContainer.style.gridTemplateColumns = `repeat(${columns}, minmax(240px, 1fr))`
})

document.getElementById("listSwitch")!
.addEventListener(
  'click', () => {
    listSwitchInput.checked = !listSwitchInput.checked
    const columns = listSwitchInput.checked ? "1" : "auto-fit"
    listContainer.style.gridTemplateColumns = `repeat(${columns}, minmax(240px, 1fr))`
    listContainer.style.width = listSwitchInput.checked ? "24rem": "auto"
    document.getElementById("firstHalf")!
    .style.flex = listSwitchInput.checked ? "0": "6"
})

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