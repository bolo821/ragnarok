import { SET_NEWS_RT } from "./types";
import api from '../utils/api';
import { setAlert } from "./alert";

export const addNews = formData => dispatch => {
    api.post('/news/add', formData, { headers: {'Content-type': 'multipart/form-data'} }).then(res => {
        if (res && res.data) {
            dispatch(getNews());
        }
    }).catch(err => {
        console.log('errorr: ', err);
    })
}

export const getNews = () => dispatch => {
    api.get('/news/').then(res => {
        if (res && res.data) {
            dispatch({
                type: SET_NEWS_RT,
                payload: res.data.data,
            });
        }
    }).catch(err => {
        console.log('error: ', err);
    });
}

export const deleteNews = id => dispatch => {
    api.delete(`/news/${id}`).then(res => {
        if (res && res.data) {
            dispatch(getNews());
        }
    }).catch(err => {
        console.log('error: ', err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }
    });
}