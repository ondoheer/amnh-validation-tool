import {kebabToCamel} from './helpers.js'

let determinedByPeople = [];
let collectors = [];
let donors = [];

export function getDeterminedByPeople () {
    return determinedByPeople
}

export function getCollectors () {
    return collectors
}

export function getDonors () {
    return donors
}

function createPersonList(formId, listId, fieldId) {
    let person = {};

    let form = document.querySelectorAll('#' + formId + ' input');

    let list = document.getElementById(listId);

    form.forEach((element) => {
        person[kebabToCamel(element.dataset.key)] = element.value;
        element.value = '';
    })

    let listItem = document.createElement('li');
    let span = document.createElement('span');
    let i = document.createElement('i');
    i.classList.add("fas", "fa-user");
    span.appendChild(i);
    listItem.appendChild(span);
    list.appendChild(listItem);
    listItem.innerHTML += person['verbatim'];
    return person
}

let determinedByButton = document.getElementById('determined-by-button');
determinedByButton.addEventListener('click', () => {
    determinedByPeople.push(createPersonList('determined-by-form', 'determined-by-list'));
});

let collectedByButton = document.getElementById('collected-by-button');
collectedByButton.addEventListener('click', () => {
    collectors.push(createPersonList('collected-by-form', 'collected-by-list'));
});

let donorButton = document.getElementById('donor-button');
donorButton.addEventListener('click', () => {
    donors.push(createPersonList('donor-form', 'donor-list'));
});
