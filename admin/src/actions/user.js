import api from '../utils/api';
import { setAlert } from './alert';
import {
  GET_USER
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
  try{
    const body = {email, title, content};
    await api.post('/users/mail', body);
  }catch(err){
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

export const sendCoinByAdmin  = (account_id, amount, token) => async dispatch => {
  try{
    const body = {account_id, amount, token};
    await api.post('/users/coin', body);
    dispatch(setAlert('Succss send Coin', 'success'));
  }catch(err){
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}