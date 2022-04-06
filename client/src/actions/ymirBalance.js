import { toast } from 'react-toastify';
import api from '../utils/api';
import { getBalanceAmount } from '../utils/formatBalance';
import { getLogs } from './logs';
import {
  GET_YMIR_WALLET_BALANCE,
  GET_YMIR_CONTRACT_BALANCE,
  GET_YMIR_FUND_BALANCE
} from './types';
import { SOCKET } from '../utils/api';

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
export const getWalletBalance = (ymirContract, account) => async (dispatch) => {
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
export const getContractBalance = (ymirContract, account) => async (dispatch) => {
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


export const getAccountBalance = (account_id, history) => async (dispatch, getState) => {
  try {
    const res = await api.get('/balance/' + account_id + '/YMIR');
    dispatch({
      type: GET_YMIR_FUND_BALANCE,
      payload: res.data
    });
    return res.data.value;
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    return 0;
  }
};

// Update Temp Balance
export const updateContractBalance = (data) => async (dispatch, getState) => {
  try {
    const res = await api.post('/balance/updatebalance', data);

    dispatch(getLogs(data.account_id));
    return res.data;
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    return false
  }
};

export const updateFunndBalance = (data) => async (dispatch, getState) => {
  try {
    const res = await api.post('/fund/updatebalance', data);
    return res.data;
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }
    console.log(err);
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
}

// Update Temp Balance
export const updateTempBalance = (data, account_id) => async (dispatch, getState) => {
  try {
    await api.post('/balance/updatetempbalance', data);
    dispatch(getContractBalance(account_id));
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
export const updateFundTempBalance = (data, account_id) => async (dispatch, getState) => {
  try {
    await api.post('/fund/updatetempbalance', data);
    dispatch(getContractBalance(account_id));
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

