// src/components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, register, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      const result = await login(email, password);
      if (result.success) {
        setSuccess(`Welcome back, ${result.user.name}!`);
        setTimeout(() => {
          if (result.user.role === 'admin') {
            window.location.href = '/admin';
          } else {
            window.location.href = '/';
          }
        }, 1500);
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      const result = register(email, password, name);
      if (result.success) {
        setSuccess(`Account created successfully! Welcome ${result.user.name}`);
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required={!isLogin}
                disabled={isLoading}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          {isLogin && (
            <div className="demo-credentials">
              <p><strong>Demo Admin:</strong></p>
              <p>Email: admin@example.com</p>
              <p>Password: admin123</p>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="toggle-form">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="btn-link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              disabled={isLoading}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;