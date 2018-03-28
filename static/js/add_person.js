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

    console.log(person);

    determinedByPeople.push(person);
    let listItem = document.createElement('li');
    let span = document.createElement('span');
    let i = document.createElement('i');
    i.classList.add("fas", "fa-user");
    span.appendChild(i);
    listItem.appendChild(span);
    determinedByList.appendChild(listItem);
    listItem.innerHTML += person['collector-name'];
}

determinedPersonBttn.addEventListener('click', addDeterminedByPerson);
