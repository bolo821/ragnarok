import { toast } from 'react-toastify';
import api from '../utils/api';
import {
  GET_USER,
  SET_USER_DATA,
} from './types';

export const getUsers = () => async dispatch => {
  try {
    const res = await api.get('/users/master');
    dispatch({
      type: GET_USER,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllUsers = () => async dispatch => {
  try {
    const res = await api.get('/users/list');
    dispatch({
      type: GET_USER,
      payload: res.data
    });
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = (account_id, state) => dispatch => {
  api.put(`/users/ban/${account_id}`, { state }).then(res => {
    if (res && res.data) {
      dispatch(getUsers());
    }
  }).catch(err => {
    console.log('error: ', err);
  });
}

export const sendMailByAdmin  = (email, title, content) => async dispatch => {
  try {
    const body = { email, title, content };
    await api.post('/users/mail', body);
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
}

export const sendCoinByAdmin  = (account_id, amount, token) => async dispatch => {
  try {
    const body = {account_id, amount, token};
    await api.post('/users/coin', body);
    toast.success('Succss send Coin');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
}

export const getUserData = account_id => async dispatch => {
  try {
    const res = await api.get(`/userdata/${account_id}`);
    if (res && res.data) {
      dispatch({
        type: SET_USER_DATA,
        payload: res.data,
      });
    }
  } catch (err) {
    console.log('error: ', err);
  }
}