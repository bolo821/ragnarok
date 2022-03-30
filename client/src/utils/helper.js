export const verifyNumberByDecimal = (num, decimal) => {
    let floatPart = num.toString().split('.');

    if (floatPart.length === 1) return true;
    else if (floatPart[1].length <= decimal) return true;
    else return false;
}