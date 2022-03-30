import {
    GET_TRANSACTION
} from '../actions/types';

const initialState = {
	transactions: []
};

function transactionReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_TRANSACTION:
      return {
      	    ...state,
      	    transactions : payload ? payload : 0
      };
    
    default:
      return state;
  }
}

export default transactionReducer;