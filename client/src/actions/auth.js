import api from '../utils/api';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {
  REGISTER_FAIL,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGOUT,
  GET_SUBACCOUNT,
  TRANSACTINO_VERIFYED,
  SET_VLOAD,
  AFTER_LOGIN,
} from './types';

import { SOCKET } from '../utils/api';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Register User (Bolo)
export const register = (formData, history) => async dispatch => {
  try {
    const res = await api.post('/auth/register', formData);

    if (res && res.data && res.data.success) {
      dispatch(setAlert('Register succefully.', 'success'))
      history.push('/login');
    };
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User (Bolo)
export const login = (email, password, history) => async dispatch => {
  try {
    const res = await api.post('/auth/login', { email, password });
    const decoded = jwt_decode(res.data.token);
    
    SOCKET.emit('CONNECT', decoded.user.account_id, new_login => {
      if (new_login) {
        setAuthToken(res.data.token);

        dispatch({
          type: AFTER_LOGIN,
          payload: decoded.user,
        });

        history.push('/emailverification');
      } else {
        dispatch(setAlert('You already logged in another place. Please logout and try again.', 'danger'));
        setTimeout(() => {
          window.open("about:blank", "_self");
          window.close();  
        }, 3000);
      }
    });
  } catch (err) {
    console.log('error: ', err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Auto login user with token stored in local storage. (New Bolo)
export const autoLogin = (token, history) => async dispatch => {
  try {
    const de_exp = jwt_decode(token);
    
    if (de_exp.exp < Date.now() / 1000) {
      dispatch(logout);
      return;
    }
    const res = await api.get('/auth/auto_login', { headers: {
      'x-auth-token': token,
    }});

    if (res && res.data && res.data.success) {
      const decoded = jwt_decode(token);

      SOCKET.emit('CONNECT', decoded.user.account_id, new_login => {
        if (new_login) {
          setAuthToken(token);
  
          dispatch({
            type: AFTER_LOGIN,
            payload: decoded.user,
          });

          history.push('/emailverification');

        } else {
          dispatch(setAlert('You already logged in another place. Please logout and try again.', 'danger'));
          setTimeout(() => {
            window.open("about:blank", "_self");
            window.close();  
          }, 3000);
        }
      });
    }
  } catch (err) {
    console.log('error: ', err);
    setAuthToken(null);
    history.push('/');
  }
}

// Send verification code (Bolo)
export const resend = () => async dispatch => {
  try {
    const res = await api.get('/auth/resendcode');

    if (res && res.data && res.data.success) {
      dispatch(setAlert('Verification code is sent successfully. Please check your email.', 'success'));
    }
  } catch (err) {
    let errors;
    if (err.response) {
      if (err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Email Verify (Bolo)
export const emailverify = (code, history) => async (dispatch, getState) => {
  try {
    const res = await api.post('/auth/verifyemail', { code });

    if (res && res.data) {
      setAuthToken(res.data.token);
      dispatch(setAlert('Your email is successfully verified.', 'success'));

      const decoded = jwt_decode(res.data.token);
      SOCKET.emit('SET_SESSION', decoded.user.account_id);
      dispatch({
        type: USER_LOADED,
        payload: decoded.user,
      });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      history.push('/dashboard');
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

// Change Password
export const changePassword = (data, history) => async dispatch => {
  try {
    const res = await api.post('/auth/changePassword', data);
    if (res && res.data && res.data.success) {
      dispatch(setAlert('Succefully changed.', 'success'))
    }
  } catch (err) {
    let errors;
    if (err.response) {
      if (err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

// Transaction Verify (Bolo)
export const transactionverify = (code, callback) => async dispatch => {
  try {
    dispatch({
      type: SET_VLOAD,
      payload: true
    });
    const res = await api.post('/auth/verifyemail', { code });

    if (res && res.data) {
      dispatch(setAlert('Verify your email succefully.', 'success'))
      dispatch(setTverify(true));
      callback();
    } else {
      dispatch(setAlert('Verify Code was not matched. Please confirm again.', 'warning'))
    }
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
};

export const setTverify = (value) => async dispatch => {
  // localStorage.setItem('transactionverify', value);
  dispatch({
    type: TRANSACTINO_VERIFYED,
    payload: value
  });
}

// Register Sub User
export const registerSubaccount = formData => async dispatch => {
  try {
    const res = await api.post('/users/subaccount', formData);
    dispatch({
      type: GET_SUBACCOUNT,
      payload: res.data
    });
    dispatch(setAlert('Register Subaccount succefully.', 'success'))
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Get sub users
export const getSubaccounts = () => async dispatch => {
  try {
    const res = await api.get('/users/subaccount');

    dispatch({
      type: GET_SUBACCOUNT,
      payload: res.data
    });
  } catch (err) {
    let errors
    if (err.response)
      if (err.response.data)
        errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Logout (Bolo)
export const logout = (history) => {
  history.push('/');
  setAuthToken(null);
  SOCKET.emit('DISCONNECT');
  return ({
    type: LOGOUT,
  })
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const walletuser = (wallet, history) => async dispatch => {
  try {
    const res = await api.get('/auth/wallet/' + wallet);

    if (res.data) {
      if (res.data.session === 1) {
        dispatch(setAlert('Someone have already logined in this account', 'danger'));
        history.push('/');
      } else {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        });
        // dispatch(loadUser(history));
      }

    } else {
      history.push('/register');
    }
  } catch (err) {
    let errors;

    if (err.response)
      if (err.response.data)
        errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
    history.push('/');
  }
};

// Change User
export const changeUser = (userid, history) => async dispatch => {
  try {
    const res = await api.post('/auth/updateuser', { userid });
    dispatch(setAlert('Succefully changed.', 'success'))
    // dispatch(loadUser(history));
  } catch (err) {
    let errors;
    if (err.response) {
      if (err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

// Change UserID
export const changeEmail = (email, history) => async dispatch => {
  try {
    const res = await api.post('/auth/email', { email });
    dispatch(setAlert('Succefully changed. You need to verify you email again.', 'success'))
    // dispatch(loadUser(history));
  } catch (err) {
    let errors;
    if (err.response) {
      if (err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}

export const forgotpassword = (searchkey) => async dispatch => {
  try {
    const res = await api.post('/auth/forgotpassword', searchkey);

    dispatch(setAlert('You will receive new password on your email.', 'success'))
    // dispatch(loadUser());
  } catch (err) {
    let errors;
    if (err.response) {
      if (err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    }
  }
}


