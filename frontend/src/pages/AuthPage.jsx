import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");

  return (
    <div>
      {mode === "login" ? (
        <SignIn onSuccess={onAuthSuccess} switchMode={() => setMode("signup")} />
      ) : (
        <SignUp onSuccess={onAuthSuccess} switchMode={() => setMode("login")} />
      )}
    </div>
  );
}
