export function kebabToCamel(str) {
    return str.replace(/(\-[A-Za-z])/g, function (m) {
        return m.toUpperCase().replace('-','')
    })
}

/**
 * Checks if the input is filled in
 * @param {string} value
 */
export const validateName = value => {
  const cleanValue = value.replace(/\s+/g, "");
  if (cleanValue.length === 0) {
    return false;
  }
  return true;
};