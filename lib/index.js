"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertRoom = void 0;
var roomCardCreator_1 = require("./roomCardCreator");
var firebaseRepo_1 = require("./firebaseRepo");
var secondHalf = document.getElementById("secondHalf");
var gradeCheckers = Array.from(document.getElementsByClassName("gradeChecker"));
var gradeCheckersContainer = document.getElementById("gradeCheckers");
var listSwitchInput = document.getElementById("listSwitchInput");
var findRoomBtn = document.getElementById("FindRoomBtn");
var roomTextField = document.getElementById("roomTextField");
var rooms = [];
var listContainer = document.getElementById("RoomsList");
var roomsAndFilters = document.getElementById("roomsAndFilters");
var dialog = document.querySelector("dialog");
var gradeToString = new Map([
    [5, "חמישית"],
    [6, "שישית"],
    [7, "שביעית"],
    [8, "שמינית"],
]);
function alertRoom(room) {
    dialog.showModal();
    dialog.onclick = function (event) {
        if (event.target == dialog) {
            event.preventDefault();
            dialog.close();
        }
    };
    console.table(dialog.firstElementChild.children);
    dialog.firstElementChild.children[0].innerHTML = "\u05D7\u05D3\u05E8 ".concat(room.number);
    dialog.firstElementChild.children[1].innerHTML =
        "\u05E0\u05D9\u05E7\u05D5\u05D3: ".concat(room.number, "<br />") +
            "\u05E9\u05DB\u05D1\u05D4: ".concat(room.grade, "<br />") +
            "\u05D7\u05D1\u05E8\u05D9 \u05D4\u05D7\u05D3\u05E8: ".concat(room.members);
    // alert(
    //   `Room ${room.number}\n` +
    //   `Points: ${room.points}\n` +
    //   `Grade: ${gradeToString.get(room.grade)!}\n` +
    //   `Members: ${room.members}`
    // )
}
exports.alertRoom = alertRoom;
listSwitchInput.onclick = function () {
    onListDisplayToggle();
};
document.getElementById("listSwitch").onclick = function () {
    onListDisplayToggle();
    listSwitchInput.checked = !listSwitchInput.checked;
};
function onListDisplayToggle() {
    listContainer.classList.toggle("listDisplay");
    gradeCheckersContainer.classList.toggle("listDisplay");
    roomsAndFilters.classList.toggle("listDisplay");
}
findRoomBtn.addEventListener('click', function () {
    if (roomTextField.value != "") {
        (0, firebaseRepo_1.getRoom)(roomTextField.value, alertRoom);
        roomTextField.value = "";
    }
});
gradeCheckers.forEach(function (gradeChecker) {
    gradeChecker.addEventListener('click', function () { onGradeCheckerClick(gradeChecker); });
});
function onGradeCheckerClick(gradeChecker) {
    var isOnlyOneGradeCheckerSelected = gradeCheckers
        .filter(function (gradeChecker) {
        return gradeChecker.firstElementChild.checked;
    }).length == 1;
    if (gradeChecker.firstElementChild.checked
        && isOnlyOneGradeCheckerSelected) {
        return;
    }
    gradeChecker.firstElementChild.checked
        = !gradeChecker.firstElementChild.checked;
    if (gradeChecker == gradeCheckers[0]) {
        gradeCheckers
            .slice(1, 5)
            .forEach(function (otherChecker) {
            otherChecker.firstElementChild
                .checked = false;
        });
    }
    else {
        gradeCheckers[0].firstElementChild
            .checked = false;
    }
    updateRoomListWithRooms(rooms);
}
(0, firebaseRepo_1.onRoomChange)(updateRoomList);
function updateRoomList(dbSnapshot) {
    rooms = [];
    dbSnapshot.forEach(function (roomSnapshot) {
        var room = {
            grade: roomSnapshot.child("grade").val(),
            number: roomSnapshot.child("number").val(),
            points: roomSnapshot.child("totalPoints").val(),
            members: roomSnapshot.child("members").val()
        };
        rooms.push(room);
    });
    //Sorting the rooms by points
    rooms = rooms.sort(function (a, b) { return a.points < b.points ? 1 : -1; });
    updateRoomListWithRooms(rooms);
}
function updateRoomListWithRooms(rooms) {
    removeAllChildNodes(listContainer);
    rooms
        .filter(function (room) { return getSelectedGrades().includes(room.grade); })
        .forEach(function (room, place) {
        (0, roomCardCreator_1.default)(room, place);
    });
}
function getSelectedGrades() {
    if (gradeCheckers[0].firstElementChild
        .checked) {
        return [5, 6, 7, 8];
    }
    var count = [];
    gradeCheckers.forEach(function (gradeChecker) {
        if (gradeChecker.firstElementChild
            .checked) {
            count.push(parseInt(gradeChecker.getAttribute("grade")));
        }
    });
    return count;
}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
