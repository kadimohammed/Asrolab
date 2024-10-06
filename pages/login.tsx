import React, { useEffect, useState } from 'react';
import '../src/app/Login.css';
import NASALogo from '../public/images/astrolab white png.png';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Loader from './Loader';
import Image from 'next/image';

const Login: React.FC = () => {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (savedEmail && savedPassword && savedRememberMe) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const validateInputs = (): boolean => {
    let valid = true;
    setEmailError(null);
    setPasswordError(null);

    if (!email) {
      setEmailError('Please enter your email.');
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address.');
        valid = false;
      }
    }

    if (!password) {
      setPasswordError('Please enter your password.');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerErrorMessage(null);

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://38.242.248.47:5090/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400`; // Set cookie for 24 hours
        
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberMe');
        }
        
        setSuccessMessage('Login successful! Redirecting to home page...');
        
        setTimeout(() => {
          router.push('/');  // Redirection to the home page
        }, 1500);
      } else {
        if (data.msg) {
          setServerErrorMessage(data.msg);
        } else {
          setServerErrorMessage('An unknown error occurred during login.');
        }
      }
    } catch {
      setServerErrorMessage('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-overlay">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        {serverErrorMessage && (
          <div className="error-message">
            {serverErrorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="logo-container">
            <Image src={NASALogo} alt="NASA Logo" className="nasa-logo" width={80} height={80} />
          </div>
          <h2 className="login-title">Login to the Mission</h2>
          
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              type="text"
              className={`input-field ${emailError ? 'input-error' : ''}`}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            {emailError && <span className="error-text">{emailError}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              className={`input-field ${passwordError ? 'input-error' : ''}`}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            {passwordError && <span className="error-text">{passwordError}</span>}
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              className="checkbox-input"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember" className="checkbox-label">Remember me</label>
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? <Loader /> : 'Start the Mission'}
          </button>
          <div className="footer-links">
            <Link href="/signup" className="footer-link">Create an account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
