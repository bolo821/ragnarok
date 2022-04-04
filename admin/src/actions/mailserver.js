import api from '../utils/api';
import { toast } from 'react-toastify';

export const setMailServer = data => dispatch => {
    api.post('/mailserver', data).then(res => {
        if (res && res.data && res.data.success) {
            toast.success('Mail server sucessfully set.');
        } else {
            toast.success('Failed.');
        }
    }).catch(err => {
        console.log('error: ', err);
        toast.error(err.response.data?.message || 'Something went wrong.');
    });
}