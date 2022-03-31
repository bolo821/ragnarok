import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { autoLogin, logout } from './actions/auth';
import { SOCKET } from './utils/api';

var gHistory = null;

const Auth = props => {
    const { children } = props;
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        SOCKET.on('FORCE_LOGOUT', () => {
            dispatch(logout(gHistory));
        });
    }, []);

    useEffect(() => {
        if (localStorage.getItem('auth-token-rt')) {
            dispatch(autoLogin(localStorage.getItem('auth-token-rt'), history));
        } else {
            history.push('/');
        }
    }, [ dispatch, history ]);

    return (
        <>
            { children }
        </>
    )
}

export default Auth;