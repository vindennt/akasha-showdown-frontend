import EventEmitter from "eventemitter3";
import { ConnectionState } from "@/types/websocket";

// TODO: use env for url
const WEBSOCKET_URL = "ws://localhost:8282/ws/subscribe";
let _instance: WebsocketConnection | null = null;

class WebsocketConnection {
  private state: ConnectionState = "CLOSED";

  readonly events = new EventEmitter();
  private socket: WebSocket | null = null;

  constructor() {
    this.state = "CLOSED"; // Init closed. Allow manual connect
  }

  connect() {
    if (this.state === "OPEN" || this.state === "CONNECTING") {
      return;
    }

    this.setState("CONNECTING");

    this.socket = new WebSocket(WEBSOCKET_URL);
    this.socket.binaryType = "arraybuffer";

    // Connection opened
    this.socket.onopen = (_) => {
      this.events.emit("websocket.open");
      this.setState("OPEN");
      console.log("WebSocket connected!");
    };

    // Connection closed
    // Code 1000 means normal closure
    this.socket.onclose = (event) => {
      console.log(
        `WebSocketConnection.onclose clean:${event.wasClean} code:${event.code} reason:${event.reason}`,
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

  disconnect() {
    if (this.socket) {
      this.socket.close(1000, "Self disconnected");
      this.socket = null;
    }
    this.setState("CLOSED");
  }

  getState(): ConnectionState {
    return this.state;
  }

  setState(newState: string) {
    this.state = newState as ConnectionState;
    this.events.emit("websocket.setState", newState);
  }

  sendMessage(data: any) {
    // Check if even connected
    if (this.state !== "OPEN" || !this.socket) {
      console.warn("Not connected");
      return;
    }

    const message = typeof data === "string" ? data : JSON.stringify(data);
    this.socket.send(message);
  }
}

export default function getWebsocketConnection(): WebsocketConnection {
  if (!_instance) {
    _instance = new WebsocketConnection();
  }
  return _instance;
}
