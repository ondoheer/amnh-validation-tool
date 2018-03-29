function createPersonList(formId, listId, fieldId) {
    let person = {};

    form = document.querySelectorAll('#' + formId + ' input');

    list = document.getElementById(listId);

    form.forEach((element) => {
        person[element.id] = element.value;
        element.value = '';
    })

    let listItem = document.createElement('li');
    let span = document.createElement('span');
    let i = document.createElement('i');
    i.classList.add("fas", "fa-user");
    span.appendChild(i);
    listItem.appendChild(span);
    list.appendChild(listItem);
    listItem.innerHTML += person[fieldId];
}

let determinedByButton = document.getElementById('determined-by-button');
determinedByButton.addEventListener('click', () => {
    createPersonList('determined-by-form', 'determined-by-list', 'determined-verbatim');
});

let collectedByButton = document.getElementById('collected-by-button');
collectedByButton.addEventListener('click', () => {
    createPersonList('collected-by-form', 'collected-by-list', 'collected-verbatim');
});

let donorButton = document.getElementById('donor-button');
donorButton.addEventListener('click', () => {
    createPersonList('donor-form', 'donor-list', 'donated-verbatim');
});
