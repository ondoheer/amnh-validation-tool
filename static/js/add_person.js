let determinedByList = document.getElementById('determined-by-list');
let determinedPersonBttn = document.getElementById('determined-person-bttn');
let determinedByForm = document.querySelectorAll('#determined-by-form input');

let determinedByPeople = [];

function addDeterminedByPerson() {
    let person = {};

    determinedByForm.forEach((element) => {
        person[element.id] = element.value;
        element.value = '';
    })

    determinedByPeople.push(person);
    let listItem = document.createElement('li');
    let span = document.createElement('span');
    let i = document.createElement('i');
    i.classList.add("fas", "fa-user");
    span.appendChild(i);
    listItem.appendChild(span);
    determinedByList.appendChild(listItem);
    listItem.innerHTML += person['determined-verbatim'];
}

determinedPersonBttn.addEventListener('click', addDeterminedByPerson);


let collectedByList = document.getElementById('collected-by-list');
let collecetedByButton = document.getElementById('collected-by-button');
let collectedByForm = document.querySelectorAll('#collected-by-form input');

let collectedByPeople = [];

function addCollectedByPerson() {
    let person = {};

    collectedByForm.forEach((element) => {
        person[element.id] = element.value;
        element.value = '';
    })
}
