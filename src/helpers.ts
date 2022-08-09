/** yoctoNear -> NEAR tokens*/
export const countNearTokens = (yoctoNear: string) =>
  Math.round(Number(BigInt(yoctoNear)) / 10e23);

export const countMedianStake = <T extends { stake: string }>(items: T[]) => {
  const sorted = Array.from(items).sort((a, b) =>
    Number(BigInt(a.stake) - BigInt(b.stake))
  );
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (
      countNearTokens(sorted[middle - 1].stake) +
      countNearTokens(sorted[middle].stake) / 2
    );
  }

  return countNearTokens(sorted[middle].stake);
};

export const countAverageStake = <T extends { stake: string }>(items: T[]) => {
  const sum = items.reduce((a, b) => a + countNearTokens(b.stake), 0);
  return sum / items.length || 0;
};

export const findSeatPrice = <T extends { stake: string }>(validators: T[]) => {
  let seatPrice = countNearTokens(validators[0].stake);
  validators.forEach((validator) => {
    const currentValue = countNearTokens(validator.stake);
    if (currentValue < seatPrice) seatPrice = currentValue;
  });
  return seatPrice;
};
