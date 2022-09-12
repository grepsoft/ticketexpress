export const padWithZeros = (number) => {
    return ("00" + number).slice(-2);
  };

export const formatAmount = (amount) => {
  return amount.toFixed(2);
}