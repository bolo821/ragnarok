import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { getMode, updateMode } from '../../actions/mode';
import { AdminLayout, AdminBody, AdminMainBody } from '../../components/adminlayout/LayoutItem';
import Sidebar from './adminSidebar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SOCKET } from '../../utils/api';

const MContainer = styled('div')(({ theme }) => ({
    width: '100vw',
    height: 'calc(100vh - 110px)',
    background: '#242735',
    display: 'flex',
    '& div': {
        margin: 'auto',
        color: 'white',
        display: 'block',
    },
    '& span': {
        fontSize: '1.5rem',
        marginLeft: '1rem',
    },
    '& input': {
        transform: 'scale(2)',
    },
}))

const DashboardBody = styled(Box)(({ theme }) => ({
    padding: '26px',
    paddingBottom: '0',
    color: '#F5F6F9',
    height: 'calc(100% - 50px)',
  }));

const SButtom = styled(Button)(({ theme }) => ({
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
            if (newMode === 'maintenance') {
                SOCKET.emit('MOVE_TO_MAINTENANCE_MODE');
            }
        }
    }

    return (
        <AdminLayout>
            <AdminBody direction='row'>
                <Sidebar />
                <AdminMainBody>
                    <DashboardBody justifyContent='center'>
                        <Grid container>
                            <MContainer>
                                <div>
                                    <input type="checkbox" onChange={ e => setFlag(e.target.checked) } checked={ flag } />
                                    <span>Switch to { flag ? 'maintenance ' : 'active ' } mode? </span>
                                    <SButtom onClick={ handleSubmit }>Confirm</SButtom>
                                </div>
                            </MContainer>
                        </Grid>
                    </DashboardBody>
                </AdminMainBody>
            </AdminBody>
        </AdminLayout>
    )
}

export default Maintenance;