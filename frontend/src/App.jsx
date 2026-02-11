import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import AdminPostPage from "./pages/AdminPostPage";

export default function App() {
  const [user, setUser] = useState(null);

  function handleLogout() {
    setUser(null);
  }

  return (
    <div>
      {user ? (
        <AdminPostPage user={user} onLogout={handleLogout} />
      ) : (
        <AuthPage onAuthSuccess={setUser} />
      )}
    </div>
  );
}
