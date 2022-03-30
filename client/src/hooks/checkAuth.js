import {useEffect, useRef} from 'react';
import { useWeb3React } from '@web3-react/core';

import { setAlert } from '../actions/alert';

// modified from https://usehooks.com/usePrevious/
export default function checkAuth(auth, user) {
	const {account, activate, active} = useWeb3React();
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
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
  }, [active, auth]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)

  return ref.current;
}
