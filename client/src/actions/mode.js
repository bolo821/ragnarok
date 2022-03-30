import { SET_MODE } from "./types";
import api from "../utils/api";

export const getMode = () => dispatch => {
    api.get('/mode/').then(res => {
        if (res && res.data) {
            dispatch({
                type: SET_MODE,
                payload: res.data.mode,
            });
        }
    }).catch(err => {
        console.log('error: ', err);
    });
}

export const updateMode = mode => dispatch => {
    api.put(`/mode/${mode}`).then(res => {
        if (res && res.data) {
            dispatch(getMode());
        }
    }).catch(err => {
        console.log('error: ', err);
    });
}