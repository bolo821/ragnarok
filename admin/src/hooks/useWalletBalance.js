/* eslint-disable */
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from '../utils/bigNumber'
import { ymiraddress } from '../config'
import YMIRABI from '../services/abis/YMIR.json';
import { useContract } from './useContract'

export const useWalletBalance = () => {
    const [balance, setBalance] = useState(BIG_ZERO)
    const { account } = useWeb3React();

    const contract = useContract(ymiraddress,YMIRABI);
    useEffect(() => {
      const fetchBalance = async () => {
        const res = await contract.balanceOf(account);
        setBalance(res)
      }
  
      if (account) {
        fetchBalance()
      }
    }, [account])
  
    return balance
  }