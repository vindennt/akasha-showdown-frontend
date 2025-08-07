import { useNavigate } from "react-router-dom";
import classes from "@/components/Home/Home.module.css";
import { Button, Text, Title, Container } from "@mantine/core";
import { Layout } from "@/components/Layout/Layout";

export function Home() {
  const navigate = useNavigate();

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
