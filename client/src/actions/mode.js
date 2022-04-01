import { SET_MODE } from "./types";
import api from "../utils/api";
import { toast } from "react-toastify";

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
    api.put(`/mode/${mode}`).then(async res => {
        if (res && res.data) {
            await dispatch(getMode());
            toast.success('Mode changed');
        }
    }).catch(err => {
        console.log('error: ', err);
    });
}