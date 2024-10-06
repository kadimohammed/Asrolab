import React, { useState } from 'react';
import axios from 'axios';
import '../src/app/SignUp.css';
import NASALogo from '../public/images/astrolab white png.png';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Loader from './Loader';
import Image from 'next/image';

const SignUp: React.FC = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [acceptTermsError, setAcceptTermsError] = useState<string | null>(null);
  
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset all errors
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setAcceptTermsError(null);
    setServerError(null);
    
    setIsLoading(true);

    let isValid = true;

    // Validate all fields
    if (fullName.trim() === '') {
      setFullNameError('Full name is required.');
      isValid = false;
    } else if (fullName.trim().length <= 5) {
      setFullNameError('Full name must be longer than 5 characters.');
      isValid = false;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email.');
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      isValid = false;
    }

    if (!acceptTerms) {
      setAcceptTermsError('You must accept the terms and conditions to create an account.');
      isValid = false;
    }

    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://38.242.248.47:5090/api/users/register', {
        username: fullName,
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      router.push('/login', { query: { successMessage: 'Registration successful! You can now log in.' } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Handle the error
        setServerError('An error occurred while creating the account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-overlay">
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="logo-container">
            <Image src={NASALogo} alt="NASA Logo" className="nasa-logo" width={80} height={80} />
          </div>
          <h2 className="signup-title">Create an Account</h2>
          
          {serverError && <div className="error-message">{serverError}</div>}
          
          <div className="input-group">
            <label htmlFor="fullName" className="input-label">Full Name</label>
            <input
              type="text"
              className={`input-field ${fullNameError ? 'input-error' : ''}`}
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
            {fullNameError && <span className="field-error">{fullNameError}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email</label>
            <input
              type="email"
              className={`input-field ${emailError ? 'input-error' : ''}`}
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {emailError && <span className="field-error">{emailError}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              className={`input-field ${passwordError ? 'input-error' : ''}`}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {passwordError && <span className="field-error">{passwordError}</span>}
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
            <input
              type="password"
              className={`input-field ${confirmPasswordError ? 'input-error' : ''}`}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
            {confirmPasswordError && <span className="field-error">{confirmPasswordError}</span>}
          </div>
          <div className="checkbox-group">
            <input
              type="checkbox"
              className="checkbox-input"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="acceptTerms" className="checkbox-label">
              I accept the terms and conditions
            </label>
            {acceptTermsError && <span className="field-error">{acceptTermsError}</span>}
          </div>
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? <Loader /> : 'Sign Up'}
          </button>
          <div className="footer-links">
            <Link href="/login" className="footer-link">Already have an account? Log in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
