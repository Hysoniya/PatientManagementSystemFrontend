import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let isConnected = false;
let subscribers = [];

export const connectSocket = (onConnect) => {

  if (isConnected) {
    if (onConnect) onConnect(stompClient);
    return;
  }

  const socket = new SockJS(process.env.REACT_APP_WS_URL);

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    debug: () => {}
  });

  stompClient.onConnect = () => {
    console.log("✅ WebSocket Connected");
    isConnected = true;

    // 🔥 run all pending subscriptions
    subscribers.forEach(sub => {
      stompClient.subscribe(sub.topic, (message) => {
        sub.callback(JSON.parse(message.body));
      });
    });

    if (onConnect) onConnect(stompClient);
  };

  stompClient.activate();
};

// 🔥 FIXED subscription logic
export const subscribeTopic = (topic, callback) => {

  if (isConnected) {
    stompClient.subscribe(topic, (message) => {
      callback(JSON.parse(message.body));
    });
  } else {
    subscribers.push({ topic, callback });
  }
};