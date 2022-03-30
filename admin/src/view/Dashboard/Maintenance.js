import React from 'react';
import styled from '@emotion/styled';

const MContainer = styled('div')(({ theme }) => ({
    width: '100vw',
    height: '100vh',
    background: '#242735',
    display: 'flex',
    '& h1': {
        margin: 'auto',
        color: 'white',
    }
}))
const Maintenance = () => {
    return (
        <MContainer>
            <h1>The site is in maintenance mode.</h1>
        </MContainer>
    )
}

export default Maintenance;