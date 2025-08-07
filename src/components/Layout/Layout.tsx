import { ReactNode } from "react";
import { Box, Container, Group, Title, Text, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import { ColorSchemeToggle } from "@/components/Misc/ColorSchemeToggle/ColorSchemeToggle";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box
        component="header"
        style={{
          padding: "1rem 0",
          borderBottom: "1px solid var(--mantine-color-gray-3)",
        }}
      >
        <Container
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Title order={4} style={{ margin: 0 }}>
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Akasha Showdown
            </Link>
          </Title>
          <Group gap="md">
            <Button variant="subtle" component={Link} to="/signin">
              Sign In
            </Button>
            <ColorSchemeToggle />
          </Group>
        </Container>
      </Box>

      <Box component="main" style={{ flex: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        style={{
          padding: "1rem 0",
          borderTop: "1px solid var(--mantine-color-gray-3)",
        }}
      >
        <Container style={{ display: "flex", justifyContent: "center" }}>
          <Text size="sm">
            &copy; {new Date().getFullYear()} Akasha Showdown
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
