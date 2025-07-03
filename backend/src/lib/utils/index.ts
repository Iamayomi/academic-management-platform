/**
 * @typedef {Object.<number, number>} TimeInMilliseconds
 */

/**
 * Generates an object mapping time units to milliseconds
 * @param {number} max - Maximum value for the time unit
 * @param {number} millisecondsPerUnit - Milliseconds per unit
 * @returns {TimeInMilliseconds} Object with time units as keys and milliseconds as values
 */
export const generateTime = (max, millisecondsPerUnit) => {
  return Array.from({ length: max }, (_, i) => i + 1).reduce((obj, unit) => {
    obj[unit] = unit * millisecondsPerUnit;
    return obj;
  }, {});
};
