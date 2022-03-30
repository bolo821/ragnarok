import React from 'react'
import store from './store';
import { Provider } from 'react-redux';
import { getLibrary } from './utils/getLibrary';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
const NetworkContextName = `${new Date().getTime()}-NETWORK`;
const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);
const Providers = ({ children }) => {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
                <Provider store={store}>{children}</Provider>
            </Web3ProviderNetwork>
        </Web3ReactProvider>
    )

}

export default Providers;