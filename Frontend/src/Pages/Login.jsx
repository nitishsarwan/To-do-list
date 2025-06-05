import React, { useState, useEffect } from 'react';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { error, loading } = useSelector((state) => state.auth);

  const token = localStorage.getItem('token');
useEffect(() => {
  if (token) {
    setEmail('');
    setPassword('');
    navigate('/home');
  }
}, [token]);
console.log(token)
  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => setLocalError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError('Please enter email and password');
      setTimeout(() => setLocalError(''), 3000);
      return;
    }
    dispatch(login(email, password));
  };
   const disabled = loading || !email.trim() || !password.trim()||!/^[^\s@]+@gmail\.com$/.test(email);

  return (
    <div className="loginMain">
      <div className="login">
        <h1>Login</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            disabled={disabled}
            style={{
              backgroundColor: disabled ? '#ccc' : '#007bff',
              color: '#fff',
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {localError && <p className="er">{localError}</p>}
        <span className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </span>
      </div>
    </div>
  );
};

export default Login;