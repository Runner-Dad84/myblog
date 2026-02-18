import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import AdminPostPage from "./pages/AdminPostPage";

export default function App() {
  const [user, setUser] = useState(null);

  async function onLogout() {
    
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!res.ok) {
        throw new Error('Logtout Failed');
      } 
      setUser(null); 
      } catch (err) {
      console.error(err);
    }
  }


  
  /*
  function handlePostCreated(newPost) {
    try{
      const res = await fetch("/api/post/create", {")
    }

  
  }
 */



  return (
    <div>
      {user ? (
        <AdminPostPage user={user} onLogout={onLogout} />
      ) : (
        <AuthPage onAuthSuccess={setUser} />
      )}
    </div>
  );
}
