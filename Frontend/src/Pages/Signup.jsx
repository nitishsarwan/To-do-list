import React, { useState, useEffect } from 'react';
import './Signup.css';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../redux/actions/authAction';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPaswword] = useState('');
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      setName('');
      setEmail('');
      setPaswword('');
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => setLocalError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  const submitHandler = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setLocalError('Please fill in all fields');
      setTimeout(() => setLocalError(''), 3000);
      return;
    }
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      setTimeout(() => setLocalError(''), 3000);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError('Please enter a valid email address');
      setTimeout(() => setLocalError(''), 3000);
      return;
    }
    dispatch(signup(name, email, password));
  };
const disabled =loading ||
              !name.trim() ||
              !email.trim() ||
              !password.trim() ||
              password.length < 6 ||
              !/^[^\s@]+@gmail\.com$/.test(email)
  return (
    <div className="signupMain">
      <div className="signup">
        <h1>Sign Up</h1>
        <form className="formSignup" onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPaswword(e.target.value)}
          />
          <button
            type="submit"
            disabled={disabled}
            style={{
              backgroundColor: disabled ? '#888' : '#007bff',
              color: '#fff',
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        {localError && <p className='er'>{localError}</p>}
        <span className='login-link'>Already have an account? <a href="/">Login</a></span>
      </div>
    </div>
  );
};

export default Signup;