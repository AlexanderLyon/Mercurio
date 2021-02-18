/**
 *
 * @param {number} amount
 * @returns {string} formatted dollar amount
 */
export const dollar = (amount) => {
  const num = Number(amount).toFixed(2);
  const withThousands = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `$${withThousands}`;
};
