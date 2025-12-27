// src/components/LoginModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../style/LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        const result = await login(email, password);
        if (result.success) {
          setSuccess(`Welcome back, ${result.user.name}!`);
          if (window.toast) {
            if (result.user.role === 'admin') {
              window.toast.success(`Welcome back Admin ${result.user.name}!`);
            } else {
              window.toast.success(`Welcome ${result.user.name}!`);
            }
          }
          setTimeout(() => {
            onLoginSuccess(result.user);
            onClose();
            window.location.reload();
          }, 1500);
        } else {
          setError(result.message || 'Invalid credentials');
        }
      } else {
        // Handle Register
        if (!name.trim()) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        const result = register(email, password, name);
        if (result.success) {
          setSuccess(`Account created successfully! Welcome ${result.user.name}`);
          if (window.toast) {
            window.toast.success(`Welcome ${result.user.name}! Your account has been created.`);
          }
          setTimeout(() => {
            onLoginSuccess(result.user);
            onClose();
            window.location.reload();
          }, 1500);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (type = 'user') => {
    if (type === 'admin') {
      setEmail();
      setPassword();
    } else {
      setEmail();
      setPassword();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-modal-header">
          <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
          <button className="close-btn" onClick={onClose} disabled={isLoading}>
            <i className="bi bi-x"></i>
          </button>
        </div>

        <div className="login-modal-tabs">
          <button
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
            disabled={isLoading}
          >
            Login
          </button>
          <button
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
            disabled={isLoading}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="bi bi-exclamation-circle"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <i className="bi bi-check-circle"></i>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
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

          {/* Demo Login Buttons */}
        

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="bi bi-arrow-clockwise spin"></i>
                Processing...
              </>
            ) : isLogin ? (
              'Login'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="login-modal-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              className="toggle-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              disabled={isLoading}
            >
              {isLogin ? 'Create Account' : 'Login'}
            </button>
          </p>
        </div>

     
      </div>
    </div>
  );
};

export default LoginModal;