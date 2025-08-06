import React, { useEffect, useState } from "react";
import { getUser, getSession } from "@/lib/auth";
import { refreshAccessToken } from "@/api/middleware/authMiddleware";
import { createItem } from "@/api/items";

const Dashboard: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();

    if (user) {
      setUserId(user.id);
      setEmail(user.email);
    } else {
      setMessage("Failed to retrieve user.");
    }
  }, []);

  const handleCreateItem = async () => {
    try {
      const response = await createItem({
        title,
        description,
      });

      if (response.ok) {
        setMessage("Item created successfully!");
        setTitle("");
        setDescription("");
      } else {
        setMessage("Failed to create item.");
      }
    } catch (error) {
      setMessage("Error creating item.");
    }
  };

  const handleRefreshSession = async () => {
    const localSession = getSession();
    if (localSession && localSession.refresh_token) {
      try {
        const refreshedSession = await refreshAccessToken(
          localSession.refresh_token
        );
        setUserId(refreshedSession.user.id);
        setEmail(refreshedSession.user.email);
      } catch (error) {
        setMessage("Failed to refresh session.");
      }
    } else {
      setMessage("No session found to refresh.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h2>Hello</h2>
      {userId && email ? (
        <>
          <p>User ID: {userId}</p>
          <p>Email: {email}</p>
          <div style={{ marginTop: "2rem" }}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", marginBottom: "0.5rem" }}
            />
            <button type="button" onClick={handleRefreshSession}>
              Refresh Session
            </button>
            <button
              type="button"
              onClick={handleCreateItem}
              disabled={!title || !description}
            >
              Create Item
            </button>
            {message && <p>{message}</p>}
          </div>
        </>
      ) : (
        <p>No user session found.</p>
      )}
    </div>
  );
};

export default Dashboard;
