import { SET_MINTER_KEY } from './types';
import api from '../utils/api';

export const getMinterKey = () => dispatch => {
    api.get('/minter').then(res => {
        if (res && res.data && res.data.token) {
            dispatch({
                type: SET_MINTER_KEY,
                payload: res.data.token,
            });
        }
    }).catch(err => {
        console.log('error: ', err);
    });
}