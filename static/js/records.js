import {kebabToCamel} from './helpers.js'
import {getDeterminedByPeople, getCollectors, getDonors} from './add_person.js'
import {getAllRecords, clearDatabase, putRecord} from './database.js'

const recordTally = document.getElementById('num_records')

function countRecords () {
    getAllRecords().then(
        records => {
            recordTally.innerHTML = records.length
        }
    )
}

function getSection (sectionId) {
    let sectionData = {}
    let inputs = document.querySelectorAll(`#${sectionId} [data-key]`)
    inputs.forEach((input) => {
        if (input.type === 'radio' && input.checked){
            sectionData[kebabToCamel(input.dataset.key)] = input.value
        } else if (input.value !== '') {
            sectionData[kebabToCamel(input.dataset.key)] = input.value
        }
    })
    return sectionData
}

function collectFormData () {
    let record = {
        "recordData": getSection('tracking-data'),
        "taxonomy": getSection('taxonomy-data'),
        "determinedBy": getSection('determined-by-data'),
        "specimenData": getSection('specimen-data'),
        "hostData": getSection('host-data'),
        "collectionData": getSection('collection-data'),
        "locationData": getSection('location-data'),
        "donationData": getSection('donation-data'),
    }
    record.determinedBy.people = getDeterminedByPeople()
    record.collectionData.collectors = getCollectors()
    record.donationData.donors  = getDonors()
    return record
}

export function clearRecords () {
    clearDatabase().then(() => {
        countRecords()
    })
}

export function saveRecord () {
    let record = collectFormData()
    putRecord(record)
    countRecords()
}

export function newRecord () {
    saveRecord()
    location.reload()
}

countRecords()