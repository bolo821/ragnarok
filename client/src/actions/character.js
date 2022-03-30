import { SET_CHARACTERS } from "./types";
import api from '../utils/api';

export const getCharacters = account_id => dispatch => {
    api.post('/character/', { account_id }).then(res => {
        if (res && res.data) {
            dispatch({
                type: SET_CHARACTERS,
                payload: res.data.data,
            });
        }
    }).catch(err => {
        console.log('error: ', err);
    });
}