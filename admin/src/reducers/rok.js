import {
  GET_ROK_CONTRACT_BALANCE,
  GET_ROK_FUND_BALANCE,
  GET_ROK_WALLET_BALANCE
} from '../actions/types';

const initialState = {
  contractBalance: 0,
  walletBalance: 0,
  fundBalance : 0
};

function rokReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_ROK_CONTRACT_BALANCE:
      return {
        ...state,
        contractBalance: payload ? payload : 0
      };
    case GET_ROK_WALLET_BALANCE:
      return {
        ...state,
        walletBalance: payload ? payload : 0
      };
    case GET_ROK_FUND_BALANCE:
      return {
        ...state,
        fundBalance: payload ? payload.value : 0
      };
    default:
      return state;
  }
}

export default rokReducer;