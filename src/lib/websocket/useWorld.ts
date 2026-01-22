import * as React from "react";
import getConnectedWorld from "@/lib/websocket/ConnectedWorld";
import { Peer, PeerChangeEvent, WorldEvent } from "@/types/websocket";

// Hook to use the websocket connection and listen for world events
export function useWorld() {
  const cw = getConnectedWorld();
  const [boxedWorld, setBoxedWorld] = React.useState({ world: cw.world });

  const worldChangeListener = React.useCallback(
    (e: WorldEvent) => {
      // Check for events that effect the world
      console.log("useWorld running worldChangeListener");
      if (
        e.type === "WELCOME" ||
        e.type === "PEER_JOIN" ||
        e.type === "PEER_LEAVE"
      ) {
        // Update the world to match any changes. Has to run after cw already updated its world map
        setBoxedWorld({ world: cw.world });
      }
    },
    [cw]
  );

  React.useEffect(() => {
    cw.websocketEvents.addListener("worldEvent", worldChangeListener);
    // Cleanup listener on unmount
    return () => {
      cw.websocketEvents.removeListener("worldEvent", worldChangeListener);
    };
  }, [cw, worldChangeListener]);

  return boxedWorld;
}

// Hook to use websocket connection to get listener for new peers or peerchanges
export function usePeer(peerId: number) {
  const cw = getConnectedWorld();

  const [boxedPeer, setBoxedPeer] = React.useState<{ peer: Peer | undefined }>({
    peer: cw.world.get(peerId),
  });

  const peerChangeListener = React.useCallback(
    (e: WorldEvent) => {
      if (e.type === "WELCOME" || e.type === "PEER_CHANGE") {
        const peerChange = e as PeerChangeEvent;
        // If event matches the peerId for the linked peer, update state to the connected world's version
        if (peerChange.id === peerId) {
          setBoxedPeer({ peer: cw.world.get(peerId) });
        }
      }
    },
    [cw, peerId]
  );

  React.useEffect(() => {
    cw.websocketEvents.addListener("worldEvent", peerChangeListener);
    // Cleanup listener on unmount
    return () => {
      cw.websocketEvents.removeListener("worldEvent", peerChangeListener);
    };
  }, [cw]);

  return boxedPeer;
}
