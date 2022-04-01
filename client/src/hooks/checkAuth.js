/* eslint-disable */
import {useEffect, useRef} from 'react';
import { useWeb3React } from '@web3-react/core';

export default function CheckAuth(auth, user) {
	const {account, active} = useWeb3React();
  const ref = useRef();
  useEffect(() => {
  	if(active && auth) {
      if(user.wallet !== account){
        ref.current = false;
        window.alert('Current wallet is not your wallet. Please connect your wallet.', 'warning');
      } else {
        ref.current = true;
      }
  	} else {
	    ref.current = false;
  	}
  }, [active, auth]);

  return ref.current;
}
