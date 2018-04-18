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


/**
 * Removes any children style elements of a given parent node
 * @param {parentId string}
 */
export const removeStyleNodes = (parentId) => {
  var parent = document.getElementById(parentId)
  var styleNodes = document.querySelectorAll(`#${parentId} style`);
  styleNodes.forEach( (element) => {
    parent.removeChild(element);
  })
}

/**
 * Reset all the input and select elements to default and remove styles of the given form
 * @param {formId}
 */
export const resetForm = (formId) => {
  var elements = document.querySelectorAll(`#${formId} input, #${formId} select`);
  elements.forEach((element) => {
    element.value = ''
  })
  removeStyleNodes(formId);
}