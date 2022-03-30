import api from '../utils/api';
import {
  GET_LOGS,
} from './types';

// Get Balance of current user (Bolo)
export const getLogs = (account_id) => async dispatch => {
  try {
    const res = await api.get('/logs/' + account_id);

    dispatch({
      type: GET_LOGS,
      payload: res.data
    });
  } catch (err) {
    console.log(err)
  }
};

// Get Balance of current user (Bolo)
export const createLogs = (account_id) => async dispatch => {
  try {
    const res = await api.post('/logs/' + account_id);

    dispatch(getLogs(account_id))
  } catch (err) {
    console.log(err)
  }
};
