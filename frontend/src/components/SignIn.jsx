import React, { useState } from 'react';

export default function SignIn({ onSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

         try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                throw new Error("Invalid credentials");
            }
            const data = await res.json();
            onSuccess(data);
             } catch (err) {
                setError(err.message);
            }
}

    return (        
        <form onSubmit={handleSubmit}>
            <input
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Sign In</button>
            <Link to="/signup" id="customBtn">Sign Up</Link>
            {error && <p>{error}</p>}
        </form>
    );
}
