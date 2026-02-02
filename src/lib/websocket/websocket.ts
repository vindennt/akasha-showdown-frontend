import EventEmitter from "eventemitter3";
import { ConnectionState } from "@/types/websocket";

// TODO: use env for abstract url
// const WEBSOCKET_URL = "ws://localhost:8686";
const WEBSOCKET_URL = "ws://localhost:8282/subscribe";
let _instance: WebsocketConnection;

class WebsocketConnection {
  private state: ConnectionState = "CLOSED";

  readonly events = new EventEmitter();
  private readonly socket: WebSocket;

  constructor(url: string) {
    this.setState("CONNECTING");

    this.socket = new WebSocket(url);
    this.socket.binaryType = "arraybuffer";

    // Connection opened
    this.socket.onopen = (_) => {
      this.events.emit("websocket.open");
      this.setState("OPEN");
    };

    // Connection closed
    // Code 1000 means normal closure
    this.socket.onclose = (event) => {
      console.log(
        `WebSocketConnection.onclose clean:${event.wasClean} code:${event.code} reason:${event.reason}`
      );

      this.setState("CLOSED");
      this.events.emit("websocket.closed");
    };

    // Messages sent
    this.socket.onmessage = (event) => {
      console.log("WebSocketConnection.onmessage", event.data);
      const data = JSON.parse(event.data);
      this.events.emit("worldEvent", data);
    };

    // Console Error
    this.socket.onerror = (event) => {
      console.warn("WebSocketConnection.onerror", this.state, event);
    };
  }

  setState(newState: string) {
    this.state = newState as ConnectionState;
    this.events.emit("websocket.setState", newState);
  }
}

export default function getWebsocketConnection() {
  if (!_instance) {
    _instance = new WebsocketConnection(WEBSOCKET_URL);
  }
  return _instance;
}
