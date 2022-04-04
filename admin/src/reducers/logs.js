import {
	GET_LOGS,
  SET_ALL_LOGS,
} from '../actions/types';

const initialState = {
	loglist: [],
  logAll: [],
};

function logsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_LOGS:
      return {
      	...state,
      	loglist: payload ? payload.data : 0
      };
    case SET_ALL_LOGS: {
      return {
        ...state,
        logAll: payload,
      }
    }
    default:
      return state;
  }
}

export default logsReducer;
