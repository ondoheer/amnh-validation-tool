/**
 * This function adds a style tag with the passed
 * rules, it's used by js
 */
export const addStyleString = str => {
  var node = document.createElement("style");
  node.innerHTML = str;
  document.body.appendChild(node);
};
