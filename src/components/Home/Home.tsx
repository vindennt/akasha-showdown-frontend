import { useNavigate } from "react-router-dom";
import { useWorld } from "@/lib/websocket/useWorld";
import classes from "@/components/Home/Home.module.css";
import { Button, Text, Title, Container } from "@mantine/core";
import { Layout } from "@/components/Layout/Layout";
import Peer from "@/components/Home/Peer";

export function Home() {
  const navigate = useNavigate();
  const { world } = useWorld();
  const peers = Array.from(world.values()).map((peer) => (
    <Peer peerId={peer.id} key={peer.id} />
  ));

  console.log("Connected Peers:");
  console.log(peers);

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
        <Text size="lg" color="dimmed" mt="md">
          Web game coming soon
        </Text>
        <Container>
          <Text>Connected Peers: {peers.length}</Text>
          {peers}
        </Container>
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
