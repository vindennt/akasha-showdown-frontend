import React, { useEffect, useState } from "react";

const Dashboard: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<string | null>(null);

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

  const handleCreateItem = async () => {
    const localSession = localStorage.getItem("session");
    if (!localSession) {
      setMessage("No session found.");
      return;
    }
    let accessToken = "";
    try {
      const parsedSession = JSON.parse(localSession);
      accessToken = parsedSession.session.access_token;
    } catch {
      setMessage("Invalid session data.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/items/create-item`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ title, description }),
        }
      );
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
