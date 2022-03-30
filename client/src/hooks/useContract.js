import { useMemo } from 'react';
import { getContract, getMinterContract } from '../utils/contracts';
import { useActiveWeb3React } from './useWeb3';

export const useContract = (
  address,
  ABI,
  withSignerIfPossible = true,
) => {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;

    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
};

export const useMinterContract = async (address, ABI) => {
  return useMemo(() => {
    if (!address || !ABI ) return null;
    try {
      return getMinterContract(
        address,
        ABI
      );
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  },[address, ABI])
}
