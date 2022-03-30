import { SET_LOADER } from '../actions/types';

const initialState = {
    loader : false
};

function loadReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_LOADER:
        return {
            ...state,
            loader: payload
        };
    default:
      return state;
  }
}

export default loadReducer;