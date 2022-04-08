import jwt_decode from 'jwt-decode';

export const verifyNumberByDecimal = (num, decimal) => {
    let floatPart = num.toString().split('.');

    if (floatPart.length === 1) return true;
    else if (floatPart[1].length <= decimal) return true;
    else return false;
}

export const checkTokenExpiration = () => {
    const currentTime = parseInt(Date.now() / 1000);

    const exp = jwt_decode(localStorage.getItem('auth-token-rt')).exp;
    if (currentTime > exp - 60) {
        return false;
    }

    return true;
}