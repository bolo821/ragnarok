import {
    GET_USER
} from '../actions/types';

const initialState = {
	userlist: []
};

function userReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_USER:
      return {
      	    ...state,
      	    userlist: payload,
      };
    
    default:
      return state;
  }
}

export default userReducer;