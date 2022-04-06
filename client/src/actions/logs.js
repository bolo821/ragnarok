import { toast } from 'react-toastify';
import api from '../utils/api';
import {
  GET_LOGS,
  SET_ALL_LOGS,
} from './types';
import { SOCKET } from '../utils/api';

// Get Balance of current user (Bolo)
export const getLogs = (account_id) => async (dispatch, getState) => {
  try {
    const res = await api.get('/logs/' + account_id);

    dispatch({
      type: GET_LOGS,
      payload: res.data
    });
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    console.log(err)
  }
};

// Get Balance of current user (Bolo)
export const createLogs = (account_id) => async (dispatch, getState) => {
  try {
    await api.post('/logs/' + account_id);

    dispatch(getLogs(account_id))
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    console.log(err)
  }
};

export const getAllLogs = () => (dispatch, getState) => {
  api.get('/logs/').then(res => {
    if (res && res.data && res.data.data) {
      dispatch({
        type: SET_ALL_LOGS,
        payload: res.data.data,
      });
    }
  }).catch(err => {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }

    const errMsg = err.response.data.message;
    toast.error(errMsg);
  });
}

export const getByInterval = (start, end) => (dispatch, getState) => {
  api.get(`/logs/interval/${start}/${end}`).then(res => {
    if (res && res.data && res.data.data) {
      dispatch({
        type: SET_ALL_LOGS,
        payload: res.data.data,
      });
    }
  }).catch(err => {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    
    const errMsg = err.response.data.message;
    toast.error(errMsg);
  });
}