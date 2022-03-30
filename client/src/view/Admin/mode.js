import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { getMode, updateMode } from '../../actions/mode';

const MContainer = styled('div')(({ theme }) => ({
    width: '100vw',
    height: '100vh',
    background: '#242735',
    display: 'flex',
    '& div': {
        margin: 'auto',
        color: 'white',
        display: 'block',
    },
    '& span': {
        fontSize: '1.5rem',
        marginRight: '1rem',
    },
    '& input': {
        transform: 'scale(2)',
    },
}))

const SButtom = styled('Button')(({ theme }) => ({
    background: '#111111',
    color: 'white',
    padding: '1rem',
    fontSize: '1.2rem',
    display: 'block',
    marginTop: '1rem',
}))

const Maintenance = () => {
    const dispatch = useDispatch();
    const mode = useSelector(state => state.mode.mode);
    const [ flag, setFlag ] = useState(false);

    useEffect(() => {
        dispatch(getMode());
    }, [ dispatch ]);

    useEffect(() => {
        if (mode === 'maintenance') setFlag(true);
        else setFlag(false);
    }, [ mode ]);

    const handleSubmit = () => {
        if (mode !== flag) {
            let newMode = flag ? 'maintenance' : 'active';
            dispatch(updateMode(newMode));
        }
    }

    return (
        <MContainer>
            <div>
                <span>Siwtch the mode.</span>
                <input type="checkbox" onChange={ e => setFlag(e.target.checked) } checked={ flag } />
                <SButtom onClick={ handleSubmit }>Confirm</SButtom>
            </div>
        </MContainer>
    )
}

export default Maintenance;