import React, { useState, useEffect, useRef } from "react";
import {
  TextInput,
  Button,
  Paper,
  Text,
  Stack,
  ScrollArea,
} from "@mantine/core";
import getWebsocketConnection from "@/lib/websocket/websocket";
import { useWorld } from "@/lib/websocket/useWorld";
import type { ChatMessageEvent } from "@/types/websocket";

type ChatMessage = {
  sender_id: number;
  message: string;
  timestamp: number;
};

export function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { myId } = useWorld();
  const scrollRef = useRef<HTMLDivElement>(null);
  const ws = getWebsocketConnection();

  useEffect(() => {
    const handleChatMessage = (event: ChatMessageEvent) => {
      if (event.type === "CHAT_MESSAGE") {
        setMessages((prev) => [
          ...prev,
          {
            sender_id: event.sender_id,
            message: event.message,
            timestamp: event.timestamp,
          },
        ]);
      }
    };

    const handleLobbyEvents = (event: any) => {
      if (event.type === "LOBBY_JOIN") {
        setMessages((prev) => [
          ...prev,
          {
            sender_id: -1,
            message: `User ${event.user_id} joined the lobby`,
            timestamp: Date.now(),
          },
        ]);
      } else if (event.type === "LOBBY_LEAVE") {
        setMessages((prev) => [
          ...prev,
          {
            sender_id: -1,
            message: `User ${event.user_id} left the lobby`,
            timestamp: Date.now(),
          },
        ]);
      }
    };

    ws.events.on("worldEvent", handleChatMessage);
    ws.events.on("worldEvent", handleLobbyEvents);

    return () => {
      ws.events.off("worldEvent", handleChatMessage);
      ws.events.off("worldEvent", handleLobbyEvents);
    };
  }, [ws]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) {
      return;
    }

    const chatMessage = {
      type: "CHAT_MESSAGE",
      sender_id: myId,
      message: inputValue,
      lobby_id: "global",
      timestamp: Date.now(),
    };

    console.log("[CHAT FRONTEND] Sending message:", chatMessage);

    try {
      // Send to server via HTTP POST
      const response = await fetch("http://localhost:8282/ws/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chatMessage),
      });

      console.log(
        "[CHAT FRONTEND] Response status:",
        response.status,
        response.statusText,
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[CHAT FRONTEND] Server error:", errorText);
      } else {
        console.log("[CHAT FRONTEND] Message sent successfully");
      }
    } catch (err) {
      console.error("[CHAT FRONTEND] Network error:", err);
    }

    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <Paper p="md" withBorder>
      <Text size="lg" fw={700} mb="sm">
        Global Lobby Chat
      </Text>

      <ScrollArea
        h={300}
        viewportRef={scrollRef}
        style={{ border: "1px solid #ccc", borderRadius: 4, padding: 8 }}
      >
        <Stack gap="xs">
          {messages.map((msg, idx) => (
            <div key={idx}>
              {msg.sender_id === -1 ? (
                <Text size="sm" c="dimmed" fs="italic">
                  {msg.message}
                </Text>
              ) : (
                <>
                  <Text size="sm" c="dimmed">
                    User {msg.sender_id}:
                  </Text>
                  <Text size="sm">{msg.message}</Text>
                </>
              )}
            </div>
          ))}
        </Stack>
      </ScrollArea>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <TextInput
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
          style={{ flex: 1 }}
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
    </Paper>
  );
}
