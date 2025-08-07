import { Switch, Group, useMantineColorScheme } from "@mantine/core";

export function ColorSchemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });

  return (
    <Group justify="center" mt="xl">
      <Switch
        checked={colorScheme === "dark"}
        onChange={toggleColorScheme}
        size="lg"
        color="dark"
        aria-label="Toggle color scheme"
      />
    </Group>
  );
}
