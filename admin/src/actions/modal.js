import {
  SET_MODAL,
} from './types';

// Get Balance of current user
export const openModal = (status, message) => async dispatch => {
  try {
    dispatch({
      type: SET_MODAL,
      payload: {status, message}
    });
  } catch (err) {
    console.log(err)
  }
};

// Get Balance of current user
export const closeModal = () => async dispatch => {
  try {
    dispatch({
      type: SET_MODAL,
      payload: {status: false, message: ''}
    });
  } catch (err) {
    console.log(err)
  }
};
