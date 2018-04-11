/**
 * Converts a valid html string representation into an html element
 * @param {html string representation} html 
 */
const htmlTextToElement = (html) => {
    const template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

/**
 * Checks if the input is filled in
 * @param {string} value 
 */
const validateUserName = (value) => {
    const cleanValue = value.replace(/\s+/g, "");
    if(cleanValue.length === 0){
        return false;
    }    
    return true;
}

/**
 * Displays an error message and adds the error class to the input field
 */
const showError = () => {
    const errorTemplate = `<div id="nameError" class='c-form__error-label u-align-center' >remeber to fill in a valid username</div>`;
    const nameInput = document.getElementById("name");

    nameInput.insertAdjacentElement("afterend", htmlTextToElement(errorTemplate));
    nameInput.classList.add("c-input--error")
}

/**
 * Adds the user tring to session storage
 * @param {string} userName 
 */
const addUser = (userName) => {
   sessionStorage.setItem("userName", userName);   
}

/**
 * Removes the error classes and html elements
 */
const cleanErrors = () => {
    const errorLabel = document.getElementById("nameError");
    const nameInput = document.getElementById("name");
    
    if(errorLabel){
        console.log("is here");
        errorLabel.remove();
        nameInput.classList.remove("c-input--error");
    }
}

/**
 * changes the window location to the long form
 */
const nextPage = () => {
    const nextLink = document.getElementById("next").href;
    window.location = nextLink;
}

/**
 * Validates that the user has entered something valid, if so
 * it adds the user to sessionStorage unser the "userName" key and 
 * transports the user to the next form
 */
const validateAndRegisterUser = () => {
    cleanErrors();
    const nameValue = document.querySelector("#name").value;
    if(validateUserName(nameValue)){
        
        addUser(nameValue);
        nextPage();
    } else {
        
        showError();
    }
    
}
const registerButton = document.querySelector("#registerUser");

registerButton.addEventListener("click", validateAndRegisterUser);