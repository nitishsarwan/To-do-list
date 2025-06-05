// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAIL = 'SIGNUP_FAIL';

// Login Action (for saga)
export const login = (email, password) => ({
  type: LOGIN_REQUEST,
  payload: { email, password }
});

// Signup Action (for saga)
export const signup = (name, email, password) => ({
  type: SIGNUP_REQUEST,
  payload: { name, email, password }
});

// Logout Action (for saga)
export const logout = () => ({
  type: LOGOUT_REQUEST
});