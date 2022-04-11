import api from '../utils/api';
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
  TRANSACTION_VERIFYED_ROK,
} from './types';

import { SOCKET } from '../utils/api';
import { toast } from 'react-toastify';

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Register User (Bolo)
export const register = (formData, history) => async dispatch => {
  try {
    const res = await api.post('/auth/register', formData);

    if (res && res.data && res.data.success) {
      toast.success('Register succefully.');
      history.push('/login');
    };
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
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
        toast.error('You already logged in another place. Please logout and try again.');
        setTimeout(() => {
          window.open("about:blank", "_self");
          window.close();  
        }, 3000);
      }
    });
  } catch (err) {
    window.grecaptcha.reset();
    console.log('error: ', err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
};

// Auto login user with token stored in local storage. (New Bolo)
export const autoLogin = (token, history) => async dispatch => {
  try {
    const res = await api.get('/auth/auto_login/0', { headers: {
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
          toast.error('You already logged in another place. Please logout and try again.');
          setTimeout(() => {
            window.open("about:blank", "_self");
            window.close();  
          }, 3000);
        }
      });
    }
  } catch (err) {
    if (err.response.status === 405) {
      const de_exp = jwt_decode(token);
      SOCKET.emit('FORCE_LOGOUT', de_exp.user.account_id);
      setAuthToken(null);
      history.push('/');
      return;
    }
    console.log('error: ', err);
    setAuthToken(null);
    history.push('/');
  }
}

// Send verification code (Bolo)
export const resend = () => async (dispatch, getState) => {
  try {
    const res = await api.get('/auth/resendcode');

    if (res && res.data && res.data.success) {
      toast.success('Verification code is sent successfully. Please check your email.');
    }
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }

    let errors;
    if (err.response) {
      if (err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
};

// Email Verify (Bolo)
export const emailverify = (code, history) => async (dispatch, getState) => {
  try {
    const res = await api.post('/auth/verifyemail', { code });

    if (res && res.data) {
      const decoded = jwt_decode(res.data.token);
      SOCKET.emit('CHECK_LOGGED_IN', decoded.user.account_id, new_login => {
        if (new_login) {
          setAuthToken(res.data.token);
          toast.success('Your email is successfully verified.');
          dispatch({
            type: USER_LOADED,
            payload: decoded.user,
          });
          dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
          });

          history.push('/dashboard');
        } else {
          toast.error('You already logged in another place. Please logout and try again.');
          setTimeout(() => {
            window.open("about:blank", "_self");
            window.close();  
          }, 3000);
        }
      });
    }
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }

    window.grecaptcha.reset();
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
};

// Change Password
export const changePassword = (data) => async (dispatch, getState) => {
  try {
    const res = await api.post('/auth/changePassword', data);
    if (res && res.data && res.data.success) {
      toast.success('Succefully changed.');
    }
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }

    let errors;
    if (err.response) {
      if (err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
}

// Transaction Verify (Bolo)
export const transactionverify = (code, callback) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_VLOAD,
      payload: true
    });
    const res = await api.post('/auth/verifyemail', { code });

    if (res && res.data) {
      toast.success('Verify your email succefully.');
      dispatch(setTverify(true));
      callback();
    } else {
      toast.warn('Verify Code was not matched. Please confirm again.');
    }
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }

    window.grecaptcha.reset();
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => toast.error(error.msg));
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

// Transaction Verify (Bolo)
export const transactionverifyROK = (code, callback) => async (dispatch, getState) => {
  try {
    dispatch({
      type: SET_VLOAD,
      payload: true
    });
    const res = await api.post('/auth/verifyemail', { code });

    if (res && res.data) {
      toast.success('Verify your email succefully.');
      dispatch(setTverifyROK(true));
      callback();
    } else {
      toast.warn('Verify Code was not matched. Please confirm again.');
    }
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }

    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
};

export const setTverifyROK = (value) => async dispatch => {
  dispatch({
    type: TRANSACTION_VERIFYED_ROK,
    payload: value
  });
}

// Register Sub User
export const registerSubaccount = formData => async (dispatch, getState) => {
  try {
    const res = await api.post('/users/subaccount', formData);
    dispatch({
      type: GET_SUBACCOUNT,
      payload: res.data
    });
    toast.success('Register Subaccount succefully.');
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }

    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Get sub users
export const getSubaccounts = () => async (dispatch, getState) => {
  try {
    const res = await api.get('/users/subaccount');

    dispatch({
      type: GET_SUBACCOUNT,
      payload: res.data
    });
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }

    let errors
    if (err.response)
      if (err.response.data)
        errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Logout (Bolo)
export const logout = (history) => dispatch => {
  setAuthToken(null);
  dispatch({ type: LOGOUT });
  SOCKET.emit('DISCONNECT');
  if (history) {
    history.push('/login');
  } else {
    window.location.href = '/login';
  }
};

export const forgotpassword = (searchkey) => async (dispatch, getState) => {
  try {
    await api.post('/auth/forgotpassword', searchkey);
    toast.success('You will receive new password on your email.');
  } catch (err) {
    if (err.response.status === 405) {
      const accoutn_id = getState().auth.user.account_id;
      SOCKET.emit('FORCE_LOGOUT', accoutn_id)
      return;
    }

    let errors;
    if (err.response) {
      if (err.response.data)
        errors = err.response.data.errors
    }

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
}


