// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../util/auth/auth.service';
import "./SignIn.css"

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    registerEmail: '',
    registerPassword: '',
    confirmPassword: '',
    rememberMe: false,
    acceptTerms: false
  });

  const [focusedInputs, setFocusedInputs] = useState({
    email: false,
    password: false,
    registerEmail: false,
    registerPassword: false,
    confirmPassword: false
  });

  const isLoginFormValid = formData.email && formData.password;

  const isRegisterFormValid = 
    formData.registerEmail &&
    formData.registerPassword &&
    formData.confirmPassword &&
    formData.registerPassword === formData.confirmPassword &&
    formData.acceptTerms;

  const toggleCard = () => {
    setIsLoginVisible(!isLoginVisible);
    setTimeout(() => {
      document.getElementById('register')?.classList.toggle('register-swap');
      document.getElementById('login')?.classList.toggle('login-swap');
    }, 50);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFocus = (inputName) => {
    setFocusedInputs(prev => ({
      ...prev,
      [inputName]: true
    }));
  };

  const handleBlur = (inputName) => {
    setFocusedInputs(prev => ({
      ...prev,
      [inputName]: false
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await authService.tryLogin(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.tryRegister(formData.registerEmail, formData.registerPassword);
      toggleCard();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="bg-image"></div>
      <div className="container">
        <div id="phone">
          <div id="content-wrapper">
            <div className={`card ${!isLoginVisible ? 'hidden' : ''}`} id="login">
              <form onSubmit={handleLogin}>
                <h1>Sign in</h1>
                <div className={`input ${focusedInputs.email || formData.email ? 'active' : ''}`}>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    name="email"
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                  />
                  <label htmlFor="email">Username or Email</label>
                </div>
                <div className={`input ${focusedInputs.password || formData.password ? 'active' : ''}`}>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    name="password"
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <span className="checkbox remember">
                  <input
                    type="checkbox"
                    id="remember"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="remember" className="read-text">Remember me</label>
                </span>
                <span className="checkbox forgot">
                  <a href="#">Forgot Password?</a>
                </span>
                <button disabled={!isLoginFormValid}>Login</button>
              </form>
              
              <a href="javascript:void(0)" id="gotologin" className="account-check" onClick={toggleCard}>
                Already have an account? <b>Sign in</b>
              </a>
            </div>

            <div className={`card ${isLoginVisible ? 'hidden' : ''}`} id="register">
              <form onSubmit={handleRegister}>
                <h1>Sign up</h1>
                <div className={`input ${focusedInputs.registerEmail || formData.registerEmail ? 'active' : ''}`}>
                  <input
                    id="register-email"
                    type="email"
                    value={formData.registerEmail}
                    name="registerEmail"
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('registerEmail')}
                    onBlur={() => handleBlur('registerEmail')}
                  />
                  <label htmlFor="register-email">Email</label>
                </div>
                <div className={`input ${focusedInputs.registerPassword || formData.registerPassword ? 'active' : ''}`}>
                  <input
                    id="register-password"
                    type="password"
                    value={formData.registerPassword}
                    name="registerPassword"
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('registerPassword')}
                    onBlur={() => handleBlur('registerPassword')}
                  />
                  <label htmlFor="register-password">Password</label>
                </div>
                <div className={`input ${focusedInputs.confirmPassword || formData.confirmPassword ? 'active' : ''}`}>
                  <input
                    id="confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    name="confirmPassword"
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('confirmPassword')}
                    onBlur={() => handleBlur('confirmPassword')}
                  />
                  <label htmlFor="confirm-password">Confirm Password</label>
                </div>
                <span className="checkbox remember">
                  <input
                    type="checkbox"
                    id="terms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="terms" className="read-text">
                    I have read <b>Terms and Conditions</b>
                  </label>
                </span>
                <button type="submit" disabled={!isRegisterFormValid}>Register</button>
              </form>
              <a href="javascript:void(0)" className="account-check" onClick={toggleCard}>
                Don't have an account? <b>Sign up</b>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;