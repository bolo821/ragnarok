import {
    GET_USER,
    SET_USER_DATA,
} from '../actions/types';

const initialState = {
	userlist: [],
  card: 0,
  costume: 0,
  equipment: 0,
};

function userReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_USER: {
      return {
      	    ...state,
      	    userlist: payload,
      };
    }
    case SET_USER_DATA: {
      return {
        ...state,
        ...action.payload,
      }
    }
    default:
      return state;
  }
}

export default userReducer;