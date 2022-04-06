import api from '../utils/api';
import { toast } from 'react-toastify';
import { SOCKET } from '../utils/api';

export const setMailServer = data => (dispatch, getState) => {
    api.post('/mailserver', data).then(res => {
        if (res && res.data && res.data.success) {
            toast.success('Mail server sucessfully set.');
        } else {
            toast.success('Failed.');
        }
    }).catch(err => {
        if (err.response.status === 405) {
            const accoutn_id = getState().auth.user.account_id;
            SOCKET.emit('FORCE_LOGOUT', accoutn_id)
            return;
          }

        console.log('error: ', err);
        toast.error(err.response.data?.message || 'Something went wrong.');
    });
}