import { Button, Text, Title } from "@mantine/core";
import { useState } from "react";
import classes from "./Home.module.css";
import { ColorSchemeToggle } from "../Misc/ColorSchemeToggle/ColorSchemeToggle";

export function Home() {
  const [response, setResponse] = useState("");

  const handleClick = async () => {
    const url = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${url}/ping`);
      const text = await res.text();
      setResponse(text);
    } catch (error) {
      setResponse("Failed to fetch");
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

      {response && (
        <Text ta="center" mt="lg">
          Response: {response}
        </Text>
      )}
    </>
  );
}
