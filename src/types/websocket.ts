// Connection states for the client WebSocket
// "CONNECTING": initial state
// "OPEN": connection is open
// "CLOSED": connection is closed
type ConnectionState = "CONNECTING" | "OPEN" | "CLOSED";

type Peer = {
  id: number;
  state: string;
  self: boolean;
};

//Types of world events from the server
// "WELCOME": sent when first connecting, includes current peers
// "PEER_JOIN": sent when a new peer joins
// "PEER_LEAVE": sent when a peer leaves
// "PEER_CHANGE": sent when a peer changes state
// "CHAT_MESSAGE": sent when a chat message is sent
// "MATCH_RESULT": game result between 2 players
type WorldEventType =
  | "WELCOME"
  | "PEER_JOIN"
  | "PEER_LEAVE"
  | "PEER_CHANGE"
  | "CHAT_MESSAGE"
  | "MATCH_RESULT";

type WorldEvent = { type: WorldEventType };
type PeerEvent = WorldEvent & { id: number };
type WelcomeEvent = PeerEvent & { type: "WELCOME"; peers: Peer[] };
type PeerJoinEvent = PeerEvent & {
  type: "PEER_JOIN";
  state: string;
};
type PeerLeaveEvent = PeerEvent & { type: "PEER_LEAVE" };
type PeerChangeEvent = PeerEvent & {
  type: "PEER_CHANGE";
  state: string;
};

type ChatMessageEvent = WorldEvent & {
  type: "CHAT_MESSAGE";
  sender_id: number;
  message: string;
  lobby_id: string;
  timestamp: number;
};

type MatchResultEvent = WorldEvent & {
  type: "MATCH_RESULT";
  winner_id: number;
  loser_id: number;
};

export type {
  ConnectionState,
  WorldEvent,
  WorldEventType,
  WelcomeEvent,
  PeerJoinEvent,
  PeerLeaveEvent,
  PeerChangeEvent,
  ChatMessageEvent,
  MatchResultEvent,
};
