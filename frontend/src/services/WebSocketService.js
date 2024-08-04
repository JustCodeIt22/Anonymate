import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs'
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const socket = new SockJS(`${BACKEND_URL}/ws`); //("http://localhost:8080/ws");
var stompClient = Stomp.over(socket);

export function connect(onMessageRecieved){
    stompClient.connect({}, (msg) => {
        stompClient.subscribe("/topic/chat", (msg) => {
            onMessageRecieved(JSON.parse(msg.body));
        })
    })
}


export function sendMessage(msg){
    if(stompClient && stompClient.connected){
        stompClient.publish({
            destination : "/app/chat",
            body : JSON.stringify(msg)
        })
    }
}


export async function createRoom(){
    const res = await axios.post(`${BACKEND_URL}/room/create`);
    return res.data;
} 


export function joinRoom(onRoomJoined, room_code){
    const new_socket = new SockJS(`${BACKEND_URL}/ws`);
    stompClient = Stomp.over(new_socket);
    stompClient.connect({}, (msg) => {
        console.log("hello");
        stompClient.subscribe(`/topic/${room_code}`, (msg) => {
            console.log("BODY : ", msg);
            onRoomJoined(JSON.parse(msg.body));
        })
    })

    console.log("join room");
}

export function sendMessageOverRoom(room_code, msg){
    if(stompClient && stompClient.connected){
        stompClient.publish({
            destination : `/app/join/${room_code}`,
            body : JSON.stringify(msg)
        })
    }
}

export function disconnect(){
    stompClient.disconnect();
}
