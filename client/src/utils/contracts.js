import {getAddress} from '@ethersproject/address';
import {Contract} from '@ethersproject/contracts';
import {AddressZero} from '@ethersproject/constants';
import api from './api';
import jwt_decode from 'jwt-decode';
import { RPC_url } from '../config';

const Provide = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

export function isAddress(value) {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}
// account is not optional
export function getSigner(
  library,
  account,
) {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library,
  account,
) {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(
  address,
  ABI,
  library,
  account,
) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account),
  );
}

export async function getMinterContract(address, ABI) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  const res = await api.get('/minter');
  if (res && res.data && res.data.token) {
    const key = jwt_decode(res.data.token);
    const minterkey = key.key;
    const provider = new Provide(minterkey, RPC_url);

    const web3 = new Web3(provider);
    return new web3.eth.Contract(ABI, address);
  } else {
    return null;
  }
}

export function getMarketContract(address, ABI) {
  return new Contract(address, ABI);
}
