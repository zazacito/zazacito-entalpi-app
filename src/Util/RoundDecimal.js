export function roundDecimal(numberToRound, numberOfDecimals) {
  let tmp = Math.pow(10, numberOfDecimals);
  return Math.round(numberToRound * tmp) / tmp;
}