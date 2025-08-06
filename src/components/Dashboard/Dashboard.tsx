import { createItem } from "@/api/items";
import { getSession } from "@/lib/auth";
import React, { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const localSession = getSession();

    if (localSession) {
      try {
        if (localSession.access_token) {
          setUserId(localSession.user.id || null);
        }
        if (localSession.user.email) {
          setEmail(localSession.user.email);
        }
      } catch (error) {
        setMessage("Failed to retrieve user session.");
      }
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
      console.error("Error creating item:", error);
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
