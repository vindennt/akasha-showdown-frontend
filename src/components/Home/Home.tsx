import { useNavigate } from "react-router-dom";
import { useWorld } from "@/lib/websocket/useWorld";
import classes from "@/components/Home/Home.module.css";
import {
  Button,
  Text,
  Title,
  Container,
  Grid,
  Paper,
  Badge,
} from "@mantine/core";
import { Layout } from "@/components/Layout/Layout";
import Peer from "@/components/Home/Peer";
import { ChatBox } from "@/components/Lobby/ChatBox";
import { MatchmakingQueue } from "@/components/Matchmaking/MatchmakingQueue";
import getWebsocketConnection from "@/lib/websocket/websocket";
import { useState, useEffect } from "react";

export function Home() {
  const navigate = useNavigate();
  const { world, myId } = useWorld();
  const [isConnected, setIsConnected] = useState(false);
  const ws = getWebsocketConnection();

  const peers = Array.from(world.values()).map((peer) => (
    <Peer peerId={peer.id} key={peer.id} isSelf={peer.id === myId} />
  ));

  useEffect(() => {
    const handleStateChange = (state: string) => {
      setIsConnected(state === "OPEN");
    };

    ws.events.on("websocket.setState", handleStateChange);

    // Check initial state
    setIsConnected(ws.getState() === "OPEN");

    return () => {
      ws.events.off("websocket.setState", handleStateChange);
    };
  }, [ws]);

  const handleConnect = () => {
    ws.connect();
  };

  const handleDisconnect = () => {
    ws.disconnect();
  };

  return (
    <Layout>
      <Container style={{ textAlign: "center", padding: "4rem 0" }}>
        <Title className={classes.title}>
          Akasha{" "}
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{ from: "pink", to: "yellow" }}
          >
            Showdown
          </Text>
        </Title>
        <Text size="lg" mt="md">
          Web game coming soon
        </Text>

        <Paper
          p="md"
          mt="xl"
          withBorder
          style={{ maxWidth: 600, margin: "0 auto", marginTop: "2rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Text size="md" fw={600}>
                Connection Status:
              </Text>
              <Badge color={isConnected ? "green" : "gray"} size="lg">
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            {!isConnected ? (
              <Button onClick={handleConnect} color="green" size="md">
                Connect to Chat
              </Button>
            ) : (
              <Button
                onClick={handleDisconnect}
                color="red"
                size="md"
                variant="outline"
              >
                Disconnect
              </Button>
            )}
          </div>
        </Paper>

        {isConnected ? (
          <>
            <Container mt="md">
              <Text>Connected Peers: {peers.length}</Text>
              {peers}
            </Container>

            <Grid mt="xl" gutter="lg">
              <Grid.Col span={6}>
                <ChatBox />
              </Grid.Col>
              <Grid.Col span={6}>
                <MatchmakingQueue />
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <Paper
            p="xl"
            mt="xl"
            withBorder
            style={{ maxWidth: 600, margin: "0 auto", marginTop: "2rem" }}
          >
            <Title order={3} mb="sm">
              Welcome!
            </Title>
          </Paper>
        )}

        <Button
          variant="filled"
          color="blue"
          size="xl"
          mt="xl"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </Button>
      </Container>
    </Layout>
  );
}
