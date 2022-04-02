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
          toast.error('You already logged in another place. Please logout and try again.');
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
      toast.success('Verification code is sent successfully. Please check your email.');
    }
  } catch (err) {
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
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
  }
};

// Change Password
export const changePassword = (data, history) => async dispatch => {
  try {
    const res = await api.post('/auth/changePassword', data);
    if (res && res.data && res.data.success) {
      toast.success('Succefully changed.');
    }
  } catch (err) {
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
export const transactionverify = (code, callback) => async dispatch => {
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
export const transactionverifyROK = (code, callback) => async dispatch => {
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
export const registerSubaccount = formData => async dispatch => {
  try {
    const res = await api.post('/users/subaccount', formData);
    dispatch({
      type: GET_SUBACCOUNT,
      payload: res.data
    });
    toast.success('Register Subaccount succefully.');
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
      errors.forEach(error => toast.error(error.msg));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Logout (Bolo)
export const logout = (history) => async dispatch => {
  try {
    setAuthToken(null);
    dispatch({ type: LOGOUT });
    SOCKET.emit('DISCONNECT');
    history.push('/login');

  } catch (err) {
    let errors;

    if (err.response)
      if (err.response.data)
        errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => toast.error(error.msg));
    }
    history.push('/login');
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const walletuser = (wallet, history) => async dispatch => {
  try {
    const res = await api.get('/auth/wallet/' + wallet);

    if (res.data) {
      if (res.data.session === 1) {
        toast.error('Someone have already logined in this account.');
        history.push('/');
      } else {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        });
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
      errors.forEach(error => toast.error(error.msg));
    }
    history.push('/');
  }
};

// Change User
export const changeUser = (userid, history) => async dispatch => {
  try {
    await api.post('/auth/updateuser', { userid });
    toast.success('Succefully changed.');
  } catch (err) {
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

// Change UserID
export const changeEmail = (email, history) => async dispatch => {
  try {
    await api.post('/auth/email', { email });
    toast.success('Succefully changed. You need to verify you email again.');
  } catch (err) {
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

export const forgotpassword = (searchkey) => async dispatch => {
  try {
    await api.post('/auth/forgotpassword', searchkey);
    toast.success('You will receive new password on your email.');
  } catch (err) {
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


