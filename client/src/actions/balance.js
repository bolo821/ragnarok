import { toast } from 'react-toastify';
import api from '../utils/api';
import { getBalanceAmount } from '../utils/formatBalance';
import { getLogs } from './logs';
import {
  GET_BALANCE,
  GET_YMIR_SUB_BALANCE,
  GET_YMIR_BALANCE,
  GET_ROK_BALANCE,
  GET_YMIR_FUND_BALANCES,
  GET_ROK_FUND_BALANCES,
} from './types';
import { SOCKET } from '../utils/api';

// Get Balances
export const getTokenBalances = (token) => async (dispatch, getState) => {
  try {
    const res = await api.get(`/balance/list/${token}`);
    if (token === 'YMIR') {
      dispatch({
        type: GET_YMIR_BALANCE,
        payload: res.data
      });
    } else {
      dispatch({
        type: GET_ROK_BALANCE,
        payload: res.data
      });
    }
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }

    console.log(err)
  }
};

// Get Balances
export const getTokenFunds = (token) => async (dispatch, getState) => {
  try {
    const res = await api.get(`/balance/fundlist/${token}`);
    if (token === 'YMIR') {
      dispatch({
        type: GET_YMIR_FUND_BALANCES,
        payload: res.data
      });
    } else {
      dispatch({
        type: GET_ROK_FUND_BALANCES,
        payload: res.data
      });
    }
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    console.log(err)
  }
};

// Get Balance of Current User Wallet
export const getWalletBalance = (ymirContract, account) => async (dispatch, getState) => {
  try {
    const res = await ymirContract.balanceOf(account);
    let amount = getBalanceAmount(res);
    dispatch({
      type: GET_BALANCE,
      payload: amount
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

// Get Balance of current user
export const getBalance = (account_id) => async (dispatch, getState) => {
  try {
    const res = await api.get('/balance/' + account_id + '/YMIR');
    dispatch({
      type: GET_YMIR_SUB_BALANCE,
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



// Update Temp Balance
export const updateTempBalance = (data, account_id) => async (dispatch, getState) => {
  try {
    await api.post('/balance/updatetempbalance', data);

    dispatch(getBalance(account_id));
    dispatch(getLogs(account_id));
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
};

// Update Temp Balance
export const updateBalance = (data, account_id) => async (dispatch, getState) => {
  try {
    await api.post('/balance/updatebalance', data);

    dispatch(getBalance(account_id));
    dispatch(getLogs(account_id));
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
};