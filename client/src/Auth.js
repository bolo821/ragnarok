import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { autoLogin } from './actions/auth';


const Auth = props => {
    const { children } = props;
    const dispatch = useDispatch();
    const history = useHistory();

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