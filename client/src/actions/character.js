import { SET_CHARACTERS } from "./types";
import api from '../utils/api';
import { SOCKET } from "../utils/api";

export const getCharacters = account_id => (dispatch, getState) => {
    api.post('/character/', { account_id }).then(res => {
        if (res && res.data) {
            dispatch({
                type: SET_CHARACTERS,
                payload: res.data.data,
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