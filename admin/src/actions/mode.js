import { SET_MODE } from "./types";
import api from "../utils/api";
import { toast } from "react-toastify";
import { SOCKET } from "../utils/api";

export const getMode = () => (dispatch, getState) => {
    api.get('/mode/').then(res => {
        if (res && res.data) {
            dispatch({
                type: SET_MODE,
                payload: res.data.mode,
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

export const updateMode = mode => (dispatch, getState) => {
    api.put(`/mode/${mode}`).then(async res => {
        if (res && res.data) {
            await dispatch(getMode());
            toast.success('Mode changed');
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