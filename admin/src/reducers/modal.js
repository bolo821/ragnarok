import {
	SET_MODAL
} from '../actions/types';

const initialState = {
	status: false,
  message: ''
};

function modalReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_MODAL:
      return {
      	...state,
      	status: payload.status,
        message: payload.message
      };
    default:
      return state;
  }
}

export default modalReducer;
