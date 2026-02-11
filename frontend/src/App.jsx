import { useState } from "react";
import AuthContainer from "./AuthContainer";
import AdminContainer from "./AdminContainer";

export default function App() {
  const [user, setUser] = useState(null);

  function handleLogout() {
    setUser(null);
  }

  return (
    <div>
      {user ? (
        <AdminContainer user={user} onLogout={handleLogout} />
      ) : (
        <AuthContainer onAuthSuccess={setUser} />
      )}
    </div>
  );
}
