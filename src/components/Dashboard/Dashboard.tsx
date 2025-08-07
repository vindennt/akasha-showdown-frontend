import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import { Layout } from "@/components/Layout/Layout";
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  TextInput,
  Button,
  Group,
  Divider,
} from "@mantine/core";
import { ChatRoom } from "@/components/Dashboard/ChatRoom";

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setEmail(user.email);
    }
  }, []);

  return (
    <Layout>
      <Container size="md" style={{ padding: "2rem 0" }}>
        <Title order={2}>Dashboard</Title>
        <Text size="sm" color="dimmed" mt="xs">
          Logged in as:{" "}
          <Text component="span" fw={500}>
            {email}
          </Text>
        </Text>

        <Divider my="lg" />

        <Title order={3} style={{ marginBottom: 8 }}>
          Lobby System
        </Title>
        <Stack gap="md" style={{ marginBottom: 16 }}>
          <Card withBorder padding="md">
            <Text fw={500} style={{ marginBottom: 8 }}>
              Your Lobbies
            </Text>
            <Stack gap="sm">
              <Text>• Awesome Game Lobby</Text>
              <Text>• Test Lobby</Text>
            </Stack>
          </Card>

          <Card withBorder padding="md">
            <Text fw={500} style={{ marginBottom: 8 }}>
              Find a Lobby
            </Text>
            <Group>
              <TextInput placeholder="Search lobbies" style={{ flex: 1 }} />
              <Button>Search</Button>
            </Group>
          </Card>

          <Card withBorder padding="md">
            <Text fw={500} style={{ marginBottom: 8 }}>
              Create a Lobby
            </Text>
            <Group>
              <TextInput placeholder="Lobby name" style={{ flex: 1 }} />
              <Button>Create</Button>
            </Group>
          </Card>
        </Stack>

        <Divider my="lg" />

        <ChatRoom />
      </Container>
    </Layout>
  );
}
