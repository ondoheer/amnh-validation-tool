/**
 * Adds a style element with the given rule as a child of the given parent element
 * @param {parentId string}
 * @param {rule string}
 */
export const addStyleString = (parentId, rule) => {
  var parent = document.getElementById(parentId);
  var node = document.createElement("style");
  node.innerHTML = rule;
  parent.appendChild(node);
};

/**
 * Gives a border to all the input fields of the given form
 * @param {formId string}
 */
export const addPlaceHolderBorders = (formId) => {
  addStyleString(formId, `#${formId} input:placeholder-shown {
                    border: 3px solid #ffa500 !important;
                  }`
  );
}