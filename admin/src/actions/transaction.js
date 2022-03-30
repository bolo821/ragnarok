import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';
import { RPC_url, ymiraddress } from '../config';
import { useContract } from '../hooks/useContract';
import YMIRABI from '../services/abis/YMIR.json';
import api from '../utils/api';
import { getBalanceAmount } from '../utils/formatBalance';
import { setAlert } from './alert';
import { getLogs } from './logs';
import {
    GET_TRANSACTION,
    GET_USER
} from './types';


// Get Balances
export const get_transactions = () => async dispatch => {
    try {
        const res = await api.get('/transaction/list');
        dispatch({
            type: GET_TRANSACTION,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });
    }
};

