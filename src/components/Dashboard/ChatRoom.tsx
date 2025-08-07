import {
  ScrollArea,
  Paper,
  Text,
  Textarea,
  Button,
  Group,
  Stack,
  Box,
  Title,
} from "@mantine/core";

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: string;
}

const currentUser = "Alice";

const sampleMessages: Message[] = [
  { id: 1, user: "Alice", text: "Hello there!", timestamp: "10:00 AM" },
  { id: 2, user: "Bob", text: "Hi Alice!", timestamp: "10:01 AM" },
  { id: 3, user: "Alice", text: "How are you?", timestamp: "10:02 AM" },
  { id: 4, user: "Bob", text: "I'm good, thanks!", timestamp: "10:03 AM" },
];

export function ChatRoom() {
  return (
    <Box>
      <Title order={4} style={{ marginBottom: 8 }}>
        Chat Room
      </Title>
      <ScrollArea style={{ height: 300, padding: "1rem" }}>
        <Stack gap="sm">
          {sampleMessages.map((msg) => (
            <Paper
              key={msg.id}
              p="sm"
              radius="md"
              withBorder
              style={{
                maxWidth: "60%",
                alignSelf: msg.user === currentUser ? "flex-start" : "flex-end",
              }}
            >
              <Text size="sm" fw={500}>
                {msg.user}
              </Text>
              <Text>{msg.text}</Text>
              <Text size="xs" color="dimmed" ta="right">
                {msg.timestamp}
              </Text>
            </Paper>
          ))}
        </Stack>
      </ScrollArea>
      <Group gap="sm" align="flex-end" style={{ marginTop: 16 }}>
        <Textarea
          placeholder="Type a message..."
          style={{ flex: 1 }}
          disabled
        />
        <Button disabled>Send</Button>
      </Group>
    </Box>
  );
}
