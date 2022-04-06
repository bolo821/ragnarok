import { toast } from 'react-toastify';
import api from '../utils/api';
import {
  GET_USER,
  SET_USER_DATA,
} from './types';
import { SOCKET } from '../utils/api';

export const getUsers = () => async (dispatch, getState) => {
  try {
    const res = await api.get('/users/master');
    dispatch({
      type: GET_USER,
      payload: res.data
    });
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    console.log(err);
  }
};

export const getAllUsers = () => async (dispatch, getState) => {
  try {
    const res = await api.get('/users/list');
    dispatch({
      type: GET_USER,
      payload: res.data
    });
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    console.log(err);
  }
};

export const updateUser = (account_id, state) => (dispatch, getState) => {
  api.put(`/users/ban/${account_id}`, { state }).then(res => {
    if (res && res.data) {
      dispatch(getUsers());
    }
  }).catch(err => {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    console.log('error: ', err);
  });
}

export const sendMailByAdmin  = (email, title, content) => async (dispatch, getState) => {
  try {
    const body = { email, title, content };
    await api.post('/users/mail', body);
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
}

export const sendCoinByAdmin  = (account_id, amount, token) => async (dispatch, getState) => {
  try {
    const body = {account_id, amount, token};
    await api.post('/users/coin', body);
    toast.success('Succss send Coin');
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
}

export const getUserData = account_id => async (dispatch, getState) => {
  try {
    const res = await api.get(`/userdata/${account_id}`);
    if (res && res.data) {
      dispatch({
        type: SET_USER_DATA,
        payload: res.data,
      });
    }
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    console.log('error: ', err);
  }
}