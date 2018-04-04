import {kebabToCamel} from './helpers.js'

class PeopleList {
    constructor(idPrefix) {
        this.people = []
        this.button = document.getElementById(`${idPrefix}-button`)
        this.form = document.querySelectorAll(`#${idPrefix}-form input`)
        this.list = document.getElementById(`${idPrefix}-list`)
        this.button.addEventListener('click', this.addToList.bind(this))
        this.createPerson = this.createPerson.bind(this)
        this.getPeople = this.getPeople.bind(this)
    }

    createPerson() {
        let person = {};
        
        this.form.forEach((element) => {
            person[kebabToCamel(element.dataset.key)] = element.value
            element.value = ''
        })
    
        let listItem = document.createElement('li')
        let span = document.createElement('span')
        let i = document.createElement('i')

        i.classList.add("fas", "fa-user")
        span.appendChild(i)
        listItem.appendChild(span)
        this.list.appendChild(listItem)

        listItem.innerHTML += person['verbatim']
        return person
    }

    addToList() {
        this.people.push(this.createPerson())
    }

    getPeople() {
        return this.people
    }
}

export const determinedByPeople = new PeopleList('determined-by')
export const collectors = new PeopleList('collected-by')
export const donors = new PeopleList('donated-by')