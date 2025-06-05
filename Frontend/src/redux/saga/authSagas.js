import { takeLatest, call, put } from 'redux-saga/effects';
import axios from 'axios';
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  LOGOUT_REQUEST,
  LOGOUT
} from '../actions/authAction';

// Worker: Login
function* loginWorker(action) {
  try {
    const res = yield call(axios.post, 'http://127.0.0.1:5000/api/v1/auth/login', {
      email: action.payload.email,
      password: action.payload.password
    });
    localStorage.setItem('token', res.data.token);
    yield put({ type: LOGIN_SUCCESS, payload: res.data });
  } catch (err) {
    yield put({
      type: LOGIN_FAIL,
      payload: err.response ? err.response.data.error : 'Login failed'
    });
  }
}

// Worker: Signup
function* signupWorker(action) {
  try {
    const res = yield call(axios.post, 'http://127.0.0.1:5000/api/v1/auth/signup', {
      name: action.payload.name,
      email: action.payload.email,
      password: action.payload.password
    });
    localStorage.setItem('token', res.data.token);
    yield put({ type: SIGNUP_SUCCESS, payload: res.data });
  } catch (err) {
    yield put({
      type: SIGNUP_FAIL,
      payload: err.response ? err.response.data.error : 'Signup failed'
    });
  }
}

// Worker: Logout
function* logoutWorker() {
  try {
    yield call(axios.post, 'http://127.0.0.1:5000/api/v1/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    localStorage.removeItem('token');
    yield put({ type: LOGOUT });
  } catch (err) {
    localStorage.removeItem('token');
    yield put({ type: LOGOUT });
  }
}

// Watchers
export default function* authSagas() {
  yield takeLatest(LOGIN_REQUEST, loginWorker);
  yield takeLatest(SIGNUP_REQUEST, signupWorker);
  yield takeLatest(LOGOUT_REQUEST, logoutWorker);
}