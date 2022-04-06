import api from '../utils/api';
import {
    GET_TRANSACTION,
} from './types';
import { SOCKET } from '../utils/api';


// Get Balances
export const get_transactions = () => async (dispatch, getState) => {
    try {
        const res = await api.get('/transaction/list');
        dispatch({
            type: GET_TRANSACTION,
            payload: res.data
        });
    } catch (err) {
        if (err.response.status === 405) {
            const accoutn_id = getState().auth.user.account_id;
            SOCKET.emit('FORCE_LOGOUT', accoutn_id)
            return;
          }
        console.log('error: ', err);
    }
};

