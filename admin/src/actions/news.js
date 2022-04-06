import { SET_NEWS_RT } from "./types";
import api from '../utils/api';
import { toast } from "react-toastify";
import { SOCKET } from "../utils/api";

export const addNews = formData => (dispatch, getState) => {
    api.post('/news/add', formData, { headers: {'Content-type': 'multipart/form-data'} }).then(res => {
        if (res && res.data) {
            dispatch(getNews());
        }
    }).catch(err => {
        if (err.response.status === 405) {
            const accoutn_id = getState().auth.user.account_id;
            SOCKET.emit('FORCE_LOGOUT', accoutn_id)
            return;
          }
        console.log('errorr: ', err);
    })
}

export const getNews = () => (dispatch, getState) => {
    api.get('/news/').then(res => {
        if (res && res.data) {
            dispatch({
                type: SET_NEWS_RT,
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

export const deleteNews = id => (dispatch, getState) => {
    api.delete(`/news/${id}`).then(res => {
        if (res && res.data) {
            dispatch(getNews());
        }
    }).catch(err => {
        if (err.response.status === 405) {
            const accoutn_id = getState().auth.user.account_id;
            SOCKET.emit('FORCE_LOGOUT', accoutn_id)
            return;
        }

        console.log('error: ', err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => toast.error(error.msg));
        }
    });
}