import {
  GET_YMIR_BALANCE,
  GET_ROK_BALANCE,
  GET_YMIR_FUND_BALANCES,
  GET_ROK_FUND_BALANCES,
} from '../actions/types';

const initialState = {
  ymirlist: [],
  roklist : [],
  ymirfundlist: [],
  rokfundlist: [],
};

function balanceReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_YMIR_BALANCE:
      return {
        ...state,
        ymirlist: payload ? payload : []
      };
    case GET_ROK_BALANCE:
      return {
        ...state,
        roklist: payload ? payload : []
      };
    case GET_YMIR_FUND_BALANCES: {
      return {
        ...state,
        ymirfundlist: payload ? payload : [],
      }
    }
    case GET_ROK_FUND_BALANCES: {
      return {
        ...state,
        rokfundlist: payload ? payload : [],
      }
    }
    default:
      return state;
  }
}

export default balanceReducer;
