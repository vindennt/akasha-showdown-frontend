import getWebsocketConnection from "@/lib/websocket/websocket";
import {
  Peer,
  PeerJoinEvent,
  PeerLeaveEvent,
  PeerChangeEvent,
  WelcomeEvent,
  WorldEvent,
} from "@/types/websocket";

let _instance: ConnectedWorld;

class ConnectedWorld {
  // Events from the websocket connection
  readonly websocketEvents;
  // Map for peers by id
  readonly world = new Map<number, Peer>();

  constructor() {
    const wc = getWebsocketConnection();
    this.websocketEvents = wc.events;

    const worldEventListener = (e: WorldEvent) => {
      switch (e.type) {
        case "WELCOME": {
          const welcomeEvent = e as WelcomeEvent;
          for (const peer of welcomeEvent.peers) {
            this.world.set(peer.id, {
              ...peer,
              self: welcomeEvent.id === peer.id,
            });
          }
          break;
        }
        case "PEER_JOIN": {
          console.log("ConnectedWorld PEER_JOIN event", e);
          const peerJoinEvent = e as PeerJoinEvent;
          const { id, state, color } = peerJoinEvent;
          this.world.set(id, { id, state, color, self: false });
          break;
        }
        case "PEER_LEAVE": {
          console.log("ConnectedWorld PEER_JOIN event", e);
          const peerLeaveEvent = e as PeerLeaveEvent;
          this.world.delete(peerLeaveEvent.id);
          break;
        }
        case "PEER_CHANGE": {
          const peerChangeEvent = e as PeerChangeEvent;
          this.world.get(peerChangeEvent.id)!.state = peerChangeEvent.state;
          break;
        }
      }
    };

    // Add a listener for worldEvents
    this.websocketEvents.addListener("worldEvent", worldEventListener);
  }
}

export default function getConnectedWorld() {
  if (!_instance) {
    _instance = new ConnectedWorld();
  }
  return _instance;
}
