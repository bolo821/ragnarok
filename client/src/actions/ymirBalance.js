import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { RPC_url, ymiraddress } from '../config';
import { useContract } from '../hooks/useContract';
import YMIRABI from '../services/abis/YMIR.json';
import api from '../utils/api';
import { getBalanceAmount } from '../utils/formatBalance';
import { setAlert } from './alert';
import { getLogs } from './logs';
import {
  GET_BALANCES,
  GET_BALANCE,
  UPDATE_BALANCE,
  GET_YMIR_WALLET_BALANCE,
  GET_YMIR_CONTRACT_BALANCE,
  GET_YMIR_FUND_BALANCE
} from './types';
const web3 = new Web3(RPC_url);

// Get Balances
export const get_balances = () => async dispatch => {
  // try {
  //   const res = await api.get('/balance/list');
  //   dispatch({
  //     type: GET_BALANCES,
  //     payload: res.data
  //   });
  // } catch (err) {
  //   dispatch({
  //     type: AUTH_ERROR
  //   });
  // }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Get Balance of Current User Wallet
export const getWalletBalance = (ymirContract, account) => async dispatch => {
  try {
    const res = await ymirContract.balanceOf(account);
    let amount = getBalanceAmount(res);
    dispatch({
      type: GET_YMIR_WALLET_BALANCE,
      payload: amount
    });

  } catch (err) {
    console.log(err)
  }
};

// Get Balance of current user
export const getContractBalance = (ymirContract, account) => async dispatch => {
  try {
    const res = await ymirContract._walletBalance(account);
    let amount = getBalanceAmount(res);
    
    dispatch({
      type: GET_YMIR_CONTRACT_BALANCE,
      payload: amount
    });
    return amount;
  } catch (err) {
    console.log(err)
    return 0;
  }
};


export const getAccountBalance = (account_id) => async dispatch => {
  try {
    const res = await api.get('/balance/' + account_id + '/YMIR');
    dispatch({
      type: GET_YMIR_FUND_BALANCE,
      payload: res.data
    });
    return res.data.value;
  } catch (err) {
    console.log(err)
    return 0;
  }
};

// Update Temp Balance
export const updateContractBalance = (data) => async dispatch => {
  try {
    const res = await api.post('/balance/updatebalance', data);

    dispatch(getLogs(data.account_id));
    return res.data;
  } catch (err) {
    return false
  }
};

export const updateFunndBalance = (data) => async dispatch => {
  try {
    const res = await api.post('/fund/updatebalance', data);
    return res.data;
    // dispatch(setAlert('Succefully withdrawed', 'success'));
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

// Update Temp Balance
export const updateTempBalance = (data, account_id) => async dispatch => {
  try {
    const res = await api.post('/balance/updatetempbalance', data);
    // dispatch(getContractBalance(account_id));
    dispatch(getLogs(account_id));
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// export const getGameBalance = (ymirContract, account) => async dispatch => {
//   try {
//     const res = await ymirContract._walletBalance(account);
//     let amount = getBalanceAmount(res);
//     dispatch({
//       type: GET_YMIR_WALLET_BALANCE,
//       payload: amount.toNumber()
//     });
//   } catch (err) {

//   }
// }

export const getFundBalance = (account_id) => async dispatch => {
  // try {
  //   const res = await api.get('/fund/' + account_id + '/YMIR');
  //   dispatch({
  //     type: GET_YMIR_FUND_BALANCE,
  //     payload: res.data
  //   });
  //   return res.data.value;
  // } catch (err) {
  //   console.log(err)
  //   return 0;
  // }
};

// Update FundTemp Balance
export const updateFundTempBalance = (data, account_id) => async dispatch => {
  try {
    const res = await api.post('/fund/updatetempbalance', data);

    dispatch(getContractBalance(account_id));

    dispatch(getLogs(account_id));

    // dispatch(setAlert('Succefully withdrawed', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

