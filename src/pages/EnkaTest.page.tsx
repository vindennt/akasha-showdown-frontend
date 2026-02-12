import { useState } from "react";
import {
  Button,
  Container,
  JsonInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

export function EnkaTest() {
  const [uid, setUid] = useState("605609252"); // TODO: remove hardcoded UID
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGetInfo = async () => {
    setLoading(true);
    setError("");
    setData("");

    try {
      // TODO: DO NOT HARDCODE THIS API PATH
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8282"}/api/enka/player/${uid}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const jsonData = await response.json();
      setData(JSON.stringify(jsonData, null, 2));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Stack>
        <Title order={2}>Enka API Test</Title>
        <Text c="dimmed">Enter Genshin Player UID.</Text>

        <Stack align="flex-start" gap="md">
          <TextInput
            label="UID"
            placeholder="UID"
            value={uid}
            onChange={(event) => setUid(event.currentTarget.value)}
            style={{ width: "100%", maxWidth: 300 }}
          />
          <Button onClick={handleGetInfo} loading={loading}>
            Get Info
          </Button>
        </Stack>

        {error && (
          <Text c="red" size="sm">
            {error}
          </Text>
        )}

        {data && (
          <JsonInput
            label="Response Data"
            value={data}
            formatOnBlur
            autosize
            minRows={10}
            maxRows={30}
            readOnly
          />
        )}
      </Stack>
    </Container>
  );
}
