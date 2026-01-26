import React, { useState } from 'react';
import './Login.css'; // Optional: for styling the form

const Login = () => {
  const [postlist, setPostlist] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle login logic here, e.g., send data to a server
    console.log('Login submitted:', { email, password });
    alert(`Attempting to log in with Email: ${email}`);
  };

  return (
    <div className="postlist-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Sign In
        </button>
        <div className="form-footer">
          <a href="/forgot-password">Forgot password?</a>
          <span>
            Not a member? <a href="/register">Register</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;