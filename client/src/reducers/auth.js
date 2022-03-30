import {
  REGISTER_SUCCESS,
  USER_LOADED,
  LOGIN_SUCCESS,
  LOGOUT,
  ACCOUNT_DELETED,
  TRANSACTINO_VERIFYED,
  GET_SUBACCOUNT,
  SET_VLOAD,
  AFTER_LOGIN,
} from '../actions/types';

const initialState = {
  token: null,
  isAuthenticated: null,
  loading: true,
  vloading: false,
  user: null,
  users: [],
  transaction_verify: false
};

function authReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case REGISTER_SUCCESS:
    case SET_VLOAD:
      return {
        ...state,
        vloading: payload,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };
    case ACCOUNT_DELETED:
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null
      };
    case TRANSACTINO_VERIFYED:
      return {
        ...state,
        loading: false,
        transaction_verify: payload
      }
    case LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
    case GET_SUBACCOUNT:
      return {
        ...state,
        users: [ state.user, ...payload.users ]
      };
    case AFTER_LOGIN: {
      return {
        ...state,
        user: payload,
        loading: false,
      }
    }
    default:
      return state;
  }
}

export default authReducer;
