import {onRoomChange} from './firebaseRepo';
import { updateRoomList } from './documentStuff';

onRoomChange(updateRoomList)

export interface Room {
  grade: number
  number: number
  points: number
  members: string
}