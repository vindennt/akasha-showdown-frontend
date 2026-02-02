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

// Manage the state of the world of connected peers
class ConnectedWorld {
  // Events from the websocket connection
  readonly websocketEvents;
  // Map for peers by id
  readonly world = new Map<number, Peer>();

  constructor() {
    const wc = getWebsocketConnection();
    this.websocketEvents = wc.events;

    // Handle each type of world event
    const worldEventListener = (e: WorldEvent) => {
      switch (e.type) {
        case "WELCOME": {
          const welcomeEvent = e as WelcomeEvent;
          for (const peer of welcomeEvent.peers) {
            const isSelf = welcomeEvent.id === peer.id;
            this.world.set(peer.id, {
              ...peer,
              self: isSelf,
            });
          }
          break;
        }
        case "PEER_JOIN": {
          const peerJoinEvent = e as PeerJoinEvent;
          const { id, state } = peerJoinEvent;
          this.world.set(id, { id, state, self: false });
          break;
        }
        case "PEER_LEAVE": {
          const peerLeaveEvent = e as PeerLeaveEvent;
          this.world.delete(peerLeaveEvent.id);
          break;
        }
        // TODO: handle peer change for state changes
        case "PEER_CHANGE": {
          console.log("Handling PEER_CHANGE event");
          const peerChangeEvent = e as PeerChangeEvent;
          this.world.get(peerChangeEvent.id)!.state = peerChangeEvent.state;
          break;
        }
      }
    };

    // Add the listener for worldEvents
    this.websocketEvents.addListener("worldEvent", worldEventListener);
  }
}

export default function getConnectedWorld() {
  if (!_instance) {
    _instance = new ConnectedWorld();
  }
  return _instance;
}
