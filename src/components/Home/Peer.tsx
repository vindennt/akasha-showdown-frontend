import * as React from "react";
import { usePeer } from "@/lib/websocket/useWorld";
import { Peer } from "@/types/websocket";
import getWebsocketConnection from "@/lib/websocket/websocket";

// TODO: non hardcoded isSelf
type Props = { peerId: number; isSelf?: boolean };
export default function PeerComponent({ peerId, isSelf = false }: Props) {
  const { peer } = usePeer(peerId);
  const peerWithSelf = peer ? { ...peer, self: isSelf } : undefined;
  const body = peerWithSelf ? (
    <PeerBody peer={peerWithSelf} />
  ) : (
    <em>no peer info</em>
  );
  return (
    <div style={{ borderRadius: "5px", padding: 5 }}>
      {body}
      <div>renders: {++_debug_renders}</div>
    </div>
  );
}

let _debug_renders = 0;

type PBProps = { peer: Peer };
function PeerBody({ peer }: PBProps) {
  const [stateFieldValue, setStateFieldValue] = React.useState(peer.state);
  const stateField = peer.self ? (
    <input
      style={{ width: 100 }}
      value={stateFieldValue}
      onFocus={(e) => {
        e.preventDefault();
        e.target.select();
      }}
      onKeyDown={(e) => {
        if (e.code === "Enter") {
          console.log("would apply");
          e.preventDefault();
          e.currentTarget.select();

          getWebsocketConnection().setState(e.currentTarget.value);
        }
      }}
      onChange={(e) => setStateFieldValue(e.currentTarget.value)}
    />
  ) : (
    <em>{peer.state}</em>
  );

  return (
    <span>
      <div>
        Peer: {peer.id} {peer.self ? <strong>(SELF)</strong> : ""}
      </div>
      <div>State: {stateField}</div>
    </span>
  );
}
