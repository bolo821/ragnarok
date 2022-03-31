import api from '../utils/api';
import { getBalanceAmount } from '../utils/formatBalance';
import { setAlert } from './alert';
import { getLogs } from './logs';
import {
  GET_BALANCE,
  GET_YMIR_SUB_BALANCE,
  GET_YMIR_BALANCE,
  GET_ROK_BALANCE,
  GET_YMIR_FUND_BALANCES,
  GET_ROK_FUND_BALANCES,
} from './types';

// Get Balances
export const getTokenBalances = (token) => async dispatch => {
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
    console.log(err)
  }
};

// Get Balances
export const getTokenFunds = (token) => async dispatch => {
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
    console.log(err)
  }
};

// Get Balance of Current User Wallet
export const getWalletBalance = (ymirContract, account) => async dispatch => {
  try {
    const res = await ymirContract.balanceOf(account);
    let amount = getBalanceAmount(res);
    dispatch({
      type: GET_BALANCE,
      payload: amount
    });
  } catch (err) {
    console.log(err)
  }
};

// Get Balance of current user
export const getBalance = (account_id) => async dispatch => {
  try {
    const res = await api.get('/balance/'+account_id + '/YMIR');
    dispatch({
      type: GET_YMIR_SUB_BALANCE,
      payload: res.data
    });
  } catch (err) {
    console.log(err)
  }
};



// Update Temp Balance
export const updateTempBalance = (data, account_id) => async dispatch => {
  try {
    const res = await api.post('/balance/updatetempbalance', data);

    dispatch(getBalance(account_id));
    dispatch(getLogs(account_id));

    // dispatch(setAlert('Succefully withdrawed', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Update Temp Balance
export const updateBalance = (data, account_id) => async dispatch => {
  try {
    const res = await api.post('/balance/updatebalance', data);

    dispatch(getBalance(account_id));
    dispatch(getLogs(account_id));

    // dispatch(setAlert('Succefully withdrawed', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};