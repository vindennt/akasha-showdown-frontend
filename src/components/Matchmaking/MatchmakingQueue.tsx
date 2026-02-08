import React, { useState, useEffect } from "react";
import { Button, Paper, Text } from "@mantine/core";
import { useWorld } from "@/lib/websocket/useWorld";
import getWebsocketConnection from "@/lib/websocket/websocket";
import type { MatchResultEvent } from "@/types/websocket";

export function MatchmakingQueue() {
  const [inQueue, setInQueue] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [matchResult, setMatchResult] = useState<string | null>(null);
  const { myId } = useWorld();
  const ws = getWebsocketConnection();

  useEffect(() => {
    const handleMatchEvents = (event: any) => {
      if (event.type === "MATCH_RESULT") {
        const resultEvent = event as MatchResultEvent;
        const isWinner = resultEvent.winner_id === myId;
        setInQueue(false);
        setMatchFound(false);
        setMatchResult(
          isWinner
            ? `You won against User ${resultEvent.loser_id}!`
            : `You lost to User ${resultEvent.winner_id}`,
        );

        // Reset after 5 seconds
        setTimeout(() => {
          setMatchResult(null);
        }, 5000);
      }
    };

    ws.events.on("worldEvent", handleMatchEvents);

    return () => {
      ws.events.off("worldEvent", handleMatchEvents);
    };
  }, [ws, myId]);

  const handleJoinQueue = async () => {
    setInQueue(true);
    setMatchFound(false);
    setMatchResult(null);

    try {
      const response = await fetch("http://localhost:8282/ws/queue/join", {
        // TODO: env url
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: myId }),
      });

      if (response.ok) {
        console.log("Joined matchmaking queue");
      }
    } catch (err) {
      console.error("Failed to join queue:", err);
      setInQueue(false);
    }
  };

  return (
    <Paper p="md" withBorder>
      <Text size="lg" fw={700} mb="sm">
        Matchmaking
      </Text>

      {!inQueue && !matchFound && !matchResult && (
        <Button onClick={handleJoinQueue} color="green" size="lg">
          Join Queue
        </Button>
      )}

      {inQueue && !matchFound && (
        <Text size="md" c="blue">
          Waiting in queue...
        </Text>
      )}

      {matchFound && !matchResult && (
        <Text size="md" c="green">
          Match found! Starting game...
        </Text>
      )}

      {matchResult && (
        <Text size="md" fw={600}>
          {matchResult}
        </Text>
      )}
    </Paper>
  );
}
