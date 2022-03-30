import { BigNumber } from '@ethersproject/bignumber'
import { BIG_TEN } from './bigNumber'

/**
 * Take a formatted amount, e.g. 15 BNB and convert it to full decimal value, e.g. 15000000000000000
 */
export const getDecimalAmount = (amount, decimals = 18) => {
  amount = amount.toString();
  const integerPart = amount.split('.')[0];
  const floatPart = amount.split('.')[1];
  if (!floatPart || parseInt(floatPart) === 0) {
    return BigNumber.from(integerPart).mul(BIG_TEN.pow(decimals));
  } else {
    let len = floatPart.length;
    if (len > 18) {
      return BigNumber.from(integerPart + floatPart.substr(0, 18));
    } else {
      return BigNumber.from(integerPart + floatPart).mul(BIG_TEN.pow(decimals - len));
    }
  }
}

export const getBalanceAmount = (amount, decimals = 18) => {
  const amountStr = BigNumber.from(amount).toString();
  let integerPart = amountStr.substr(0, amountStr.length - decimals) ? amountStr.substr(0, amountStr.length - 18) : '0';
  let floatPart = amountStr.substr(amountStr.length - decimals, 3);
  return integerPart + '.' + floatPart;
}

/**
 * This function is not really necessary but is used throughout the site.
 */
export const getBalanceNumber = (balance, decimals = 18) => {
  return getBalanceAmount(balance, decimals);
}

export const getFullDisplayBalance = (balance, decimals = 18, decimalsToAppear) => {
  return balance.div(BIG_TEN.pow(decimals)).toFixed(decimalsToAppear)
}

export const formatNumber = (number, minPrecision = 2, maxPrecision = 2) => {
  const options = {
    minimumFractionDigits: minPrecision,
    maximumFractionDigits: maxPrecision,
  }
  return number.toLocaleString(undefined, options)
}