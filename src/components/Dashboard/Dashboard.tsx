// import { em } from "@mantine/core";
import React, { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const localSession = localStorage.getItem("session");

    if (localSession) {
      try {
        const parsedSession = JSON.parse(localSession);
        if (parsedSession.session.access_token) {
          setUserId(parsedSession.user.id || null);
        }
        if (parsedSession.user.email) {
          setEmail(parsedSession.user.email);
        }
      } catch (error) {
        console.error("Failed to parse session from localStorage", error);
      }
    }
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h2>Hello</h2>
      {userId && email ? (
        <>
          <p>User ID: {userId}</p>
          <p>Email: {email}</p>
        </>
      ) : (
        <p>No user session found.</p>
      )}
    </div>
  );
};

export default Dashboard;
