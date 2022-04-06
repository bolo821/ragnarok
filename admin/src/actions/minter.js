import { SET_MINTER_KEY } from './types';
import { SOCKET } from '../utils/api';
import api from '../utils/api';

export const getMinterKey = () => (dispatch, getState) => {
    api.get('/minter').then(res => {
        if (res && res.data && res.data.token) {
            dispatch({
                type: SET_MINTER_KEY,
                payload: res.data.token,
            });
        }
    }).catch(err => {
        if (err.response.status === 405) {
            const accoutn_id = getState().auth.user.account_id;
            SOCKET.emit('FORCE_LOGOUT', accoutn_id)
            return;
          }
        console.log('error: ', err);
    });
}