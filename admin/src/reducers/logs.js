import {
	GET_LOGS
} from '../actions/types';

const initialState = {
	loglist: []
};

function logsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_LOGS:
      return {
      	...state,
      	loglist: payload ? payload.data : 0
      };
    default:
      return state;
  }
}

export default logsReducer;
