const errors = {
  introIvalidUsername: "Remember to fill in a valid username",
  longFormNoUserName: "You have to enter your Name before entering data",
  addPersonNoVerbatim: "You must enter a Verbatim Name before adding a Person",
  noPlacesFound: "No details about the place you searched for",
  googleMapsError: "Error Status in Google Maps search: ",
  noTaxnomoniesFound:
    "Worms couldn't find that taxonomy, try searching it by hand "
};

/**
 * Converts a valid html string representation into an html element
 * @param {html string representation} html
 */
const htmlTextToElement = html => {
  const template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
};

/**
 * Displays an error message and adds the error class to the input field
 */
export const showError = (elementId, text, center=true) => {
  var centerClass = center ? 'u-align-center' : ''
  const errorTemplate = `<div id="Error" class='c-form__error-label ${centerClass}' >${text}</div>`;
  const nameInput = document.getElementById(elementId);

  nameInput.insertAdjacentElement("afterend", htmlTextToElement(errorTemplate));
  nameInput.classList.add("c-input--error");
};

/**
 * Removes the error classes and html elements
 */
export const cleanErrors = (labelId, inputId) => {
  const errorLabel = document.getElementById(labelId);
  const nameInput = document.getElementById(inputId);

  if (errorLabel) {
    errorLabel.remove();
    nameInput.classList.remove("c-input--error");
  }
};

export default errors;
