import React from "react";

import { AuthenticationForm } from "@/components/Auth/AuthenticationForm";

const Auth: React.FC = () => {
  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h2>Login</h2>
      <AuthenticationForm />
    </div>
  );
};

export default Auth;
