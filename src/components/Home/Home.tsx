import { Button, Text, Title } from "@mantine/core";
import { useState } from "react";
import classes from "./Home.module.css";
import { ColorSchemeToggle } from "../Misc/ColorSchemeToggle/ColorSchemeToggle";
import { pingHealth } from "../../api/health";

export function Home() {
  const [health, setHealth] = useState("");

  const handleClick = async () => {
    try {
      const text = await pingHealth();
      setHealth(text);
    } catch (error: any) {
      setHealth(error?.message || "Failed to fetch");
    }
  };

  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Akasha{" "}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: "pink", to: "yellow" }}
        >
          Showdown
        </Text>
        <ColorSchemeToggle />
      </Title>

      <Text ta="center" mt="xl">
        Web game coming soon
      </Text>
      <Button
        variant="filled"
        color="blue"
        mt="xl"
        mx="auto"
        display="block"
        onClick={() => {
          handleClick();
        }}
      >
        Ping
      </Button>

      {health && (
        <Text ta="center" mt="lg">
          Response: {health}
        </Text>
      )}
    </>
  );
}
