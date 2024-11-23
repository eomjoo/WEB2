// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../util/auth/auth.service';
import "./SignIn.css";

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
    acceptTerms: false,
  });

  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태 추가
  const [focusedInputs, setFocusedInputs] = useState({
    email: false,
    password: false,
    registerEmail: false,
    registerPassword: false,
    confirmPassword: false,
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
    setErrorMessage(''); // 폼 전환 시 에러 메시지 초기화
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFocus = (inputName) => {
    setFocusedInputs((prev) => ({
      ...prev,
      [inputName]: true,
    }));
  };

  const handleBlur = (inputName) => {
    setFocusedInputs((prev) => ({
      ...prev,
      [inputName]: false,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
  
    // 로컬 스토리지에서 사용자 목록 가져오기
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // 입력된 이메일과 비밀번호로 사용자 확인
    const user = users.find(
      (user) => user.id === formData.email && user.password === formData.password
    );
  
    if (user) {
      // 성공: 메시지 초기화, 성공 알림, 페이지 이동
      setErrorMessage('');
      alert('로그인 성공! 환영합니다.');
      navigate('/');
    } else {
      // 실패: 에러 메시지 설정 및 실패 알림
      setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다.');
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authService.tryRegister(formData.registerEmail, formData.registerPassword);
      alert('회원가입 성공! 이제 로그인할 수 있습니다.');
      toggleCard();
    } catch (error) {
      setErrorMessage(error.message);
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
                {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                  <label htmlFor="remember" className="read-text">
                    Remember me
                  </label>
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
                {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                <button type="submit" disabled={!isRegisterFormValid}>
                  Register
                </button>
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
