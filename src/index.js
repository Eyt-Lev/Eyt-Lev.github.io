import createCard from './roomCardCreator.js'
import {getRoom, onRoomChange} from './firebasseRepo.js';
import {MDCRipple} from '@material/ripple';

MDCRipple.attachTo(document.querySelector('.mdc-button'));

const listSwitchInput = document.getElementById("listSwitchInput")
const findRoomBtn = document.getElementById("FindRoomBtn")
const roomTextFeild = document.getElementById("roomTextFeild")
var rooms = []
const listContainer = document.getElementById("RoomsList")
const gradeToString = {
  5: "חמישית",
  6: "שישית",
  7: "שביעית",
  8: "שמינית",
}

export function alertRoom(room){
  alert(
    `Room ${room.number}\n` +
    `Points: ${room.points}\n` +
    `Grade: ${gradeToString[room.grade]}\n` +
    `Members: ${room.members}`
  )
}

listSwitchInput.addEventListener(
  'click', () => {
    const coloumns = listSwitchInput.checked ? "1" : "auto-fit"
    listContainer.style.gridTemplateColumns = `repeat(${coloumns}, minmax(240px, 1fr))`
})

document.getElementById("listSwitch")
.addEventListener(
  'click', () => {
    listSwitchInput.checked = !listSwitchInput.checked
    const coloumns = listSwitchInput.checked ? "1" : "auto-fit"
    listContainer.style.gridTemplateColumns = `repeat(${coloumns}, minmax(240px, 1fr))`
})

findRoomBtn.addEventListener(
  'click', () => {
    if(roomTextFeild.value != ""){
      getRoom(roomTextFeild.value, alertRoom)
      roomTextFeild.value = ""
    }
})

onRoomChange(updateRoomList)

function updateRoomList(dbSnapshot){
  removeAllChildNodes(listContainer)
  rooms = []
  dbSnapshot.forEach(roomSnapshot => {
    let room = new Room(
      roomSnapshot.child("grade").val(),
      roomSnapshot.child("number").val(),
      roomSnapshot.child("totalPoints").val(),
      roomSnapshot.child("members").val()
    )
    rooms.push(room)
  });
  //Sorting the rooms by points
  rooms = rooms.sort((a, b) => a.points < b.points ? 1 : -1)
  
  rooms.forEach(function(room, place){
    createCard(room, place)
  })
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

export class Room {
  constructor(grade, number, points, members){
    this.grade = grade
    this.number = number
    this.points = points
    this.members = members
  }
}