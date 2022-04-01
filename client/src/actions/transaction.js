import api from '../utils/api';
import {
    GET_TRANSACTION,
} from './types';


// Get Balances
export const get_transactions = () => async dispatch => {
    try {
        const res = await api.get('/transaction/list');
        dispatch({
            type: GET_TRANSACTION,
            payload: res.data
        });
    } catch (err) {
        console.log('error: ', err);
    }
};

