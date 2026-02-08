import * as React from "react";
import { usePeer } from "@/lib/websocket/useWorld";
import { Peer } from "@/types/websocket";
import getWebsocketConnection from "@/lib/websocket/websocket";

type Props = { peerId: number; isSelf?: boolean };

const PeerComponent = React.memo(({ peerId, isSelf = false }: Props) => {
  const renderCount = React.useRef(0);
  renderCount.current++;

  const { peer } = usePeer(peerId);
  const p = peer ? { ...peer, self: isSelf } : undefined;
  const body = p ? <PeerBody peer={p} /> : <em>no peer info</em>;
  return (
    <div style={{ borderRadius: "5px", padding: 5 }}>
      {body}
      <div>renders: {renderCount.current}</div>
    </div>
  );
});

type PBProps = { peer: Peer };

const PeerBody = React.memo(({ peer }: PBProps) => {
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
});

export default PeerComponent;
