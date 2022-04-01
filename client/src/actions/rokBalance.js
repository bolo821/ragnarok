import { toast } from 'react-toastify';
import api from '../utils/api';
import { getBalanceAmount } from '../utils/formatBalance';
import { getLogs } from './logs';
import {
  GET_ROK_WALLET_BALANCE,
  GET_ROK_CONTRACT_BALANCE,
  GET_ROK_FUND_BALANCE
} from './types';

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

// Get Balance of Current User Wallet
export const getWalletBalance = (rokContract, account) => async dispatch => {
  try {
    const res = await rokContract.balanceOf(account);
    let amount = getBalanceAmount(res);
    dispatch({
      type: GET_ROK_WALLET_BALANCE,
      payload: amount,
    });

  } catch (err) {
    console.log(err)
  }
};

// Get Balance of current user
export const getContractBalance = (rokContract, account) => async dispatch => {
  try {

    const res = await rokContract._walletBalance(account);
    let amount = getBalanceAmount(res);
    
    // const res = await rokContract.balanceOf(account);
    // let amount = getBalanceAmount(res);
    dispatch({
      type: GET_ROK_CONTRACT_BALANCE,
      payload: amount,
    });
    return amount;
  } catch (err) {
    console.log(err)
    return 0;
  }
};


export const getAccountBalance = (account_id) => async dispatch => {
  try {
    const res = await api.get('/balance/' + account_id + '/ROK');
    // const res = await rokContract.balanceOf(account);
    // let amount = getBalanceAmount(res);
    dispatch({
      type: GET_ROK_FUND_BALANCE,
      payload: res.data
    });
    return res.data.value;
  } catch (err) {
    console.log(err)
    return 0;
  }
};


// export const getGameBalance = (rokContract, account) => async dispatch => {
//   try {
//     const res = await rokContract._walletBalance(account);
//     let amount = getBalanceAmount(res);
//     dispatch({
//       type: GET_ROK_WALLET_BALANCE,
//       payload: amount,
//     });
//   } catch (err) {

//   }
// }

export const getFundBalance = (account_id) => async dispatch => {
  try {
    const res = await api.get('/fund/' + account_id + '/ROK');
    // const res = await rokContract.balanceOf(account);
    // let amount = getBalanceAmount(res);
    dispatch({
      type: GET_ROK_FUND_BALANCE,
      payload: res.data
    });
    return res.data.value;
  } catch (err) {
    console.log(err)
    return 0;
  }
};

export const updateFunndBalance = (data, account_id) => async dispatch => {
  try {
    const res = await api.post('/fund/updatebalance', data);
    return res.data;
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
}

// Update FundTemp Balance
export const updateFundTempBalance = (data, account_id) => async dispatch => {
  try {
    await api.post('/fund/updatetempbalance', data);

    dispatch(getContractBalance(account_id));

    dispatch(getLogs(account_id));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
};

// Update Temp Balance
export const updateTempBalance = (data, account_id) => async dispatch => {
  try {
    await api.post('/balance/updatetempbalance', data);
    dispatch(getContractBalance(account_id));
    dispatch(getLogs(account_id));

  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
};

// Update Temp Balance
export const updateContractBalance = (data, account_id) => async dispatch => {
  try {
    const res = await api.post('/balance/updatebalance', data);
    dispatch(getLogs(account_id));
    return res.data;
  } catch (err) {
    return false
  }
};