import Ajv from 'ajv'
import idb from 'idb'
import jsonSchema from '../assets/json/schema.json'
import csvHeaders from '../assets/json/headers.json'
import example from '../assets/json/example.json'
import {kebabToCamel} from './helpers.js'
import {getDeterminedByPeople, getCollectors, getDonors} from './add_person.js'

// const jsonSchema = require('../assets/json/header.json')
// const csvHeaders = require('../assets/json/schema.json')

let currentRecord = null

function upgradeCallback (upgradeDb) {
    console.log('Upgrading IndexedDB')
    if (!upgradeDb.objectStoreNames.contains('records')) {
        upgradeDb.createObjectStore('records',  {keyPath: 'id', autoIncrement: true})
    }
}

let dbPromise = idb.open('AMNHMarineDatabase', 1, upgradeCallback)
let ajv = new Ajv()
let jsonValidator = ajv.compile(jsonSchema)

function putRecord (record) {
    if (!jsonValidator(record)){
        console.error(jsonValidator.errors)
        return
    }

    return dbPromise.then(db => {
        const tx = db.transaction('records', 'readwrite')
        let objectStore = tx.objectStore('records')
        if (currentRecord) {
            record.id = currentRecord
        }
        objectStore.put(record).then(result => {
            currentRecord = result
        })
        return tx.complete
    })
}

function getRecord (recordId) {
    return dbPromise.then(db => {
        return db.transaction('records').objectStore('records').get(recordId)
    })
}

function getAllRecords () {
    return new Promise((resolve, reject) => {
        dbPromise.then(db => {
            return db.transaction('records').objectStore('records').getAll()
        }).then((data) => {
            resolve(data)
        })
    })
}

function deleteRecord (recordId) {
    return dbPromise.then(db => {
        const tx = db.transaction('records', 'readwrite')
        tx.objectStore('records').delete(recordId)
        return tx.complete
    })
}

function clearRecords () {
    return dbPromise.then(db => {
        const tx = db.transaction('records', 'readwrite')
        tx.objectStore('records').clear()
        return tx.complete
    })
}

function writeCSV (records) {
    let columnDelimiter = ','
    let lineDelimiter = '\n'
    let result = ''
    let firstElement = true
    var attribute

    if (records == null || !records.length) {
        return null;
    }

    let headers = Object.keys(csvHeaders)
    result += headers.join(columnDelimiter) + lineDelimiter

    records.forEach(record => {
        headers.forEach(header => {
            if (!firstElement) result += columnDelimiter
            try {
                attribute = eval("record." + csvHeaders[header])
            } catch (e) {
                attribute = ''
            }
            result +=  attribute === 'undefined' || attribute == null ? '' : attribute
            firstElement = false
        })
        result += lineDelimiter
        firstElement = true
    })

    return result
}

function countRecords () {
    getAllRecords().then(
        records => {
            let recordTally = document.getElementById('num_records')
            recordTally.innerHTML = records.length

        }
    )
}

function exportCSV () {
    getAllRecords().then(
        records => {
            var data, filename, link
            var csvString = writeCSV(records)

            if (csvString == null) alert("Nothing to Export")

            filename = 'export.csv'
        
            if (!csvString.match(/^data:text\/csv/i)) {
                csvString = 'data:text/csv;charset=utf-8,' + csvString
            }
            data = encodeURI(csvString)
        
            link = document.createElement('a')
            link.setAttribute('href', data)
            link.setAttribute('download', filename)
            link.click()
        }
    )
}

function getSection (sectionId) {
    let sectionData = {}
    let inputs = document.querySelectorAll(`#${sectionId} [data-key]`)
    inputs.forEach((input) => {
        if (input.value !== '') {
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

function clearDatabase () {
    clearRecords().then(() => {
        countRecords()
    })
}

function clearForm () {
    let inputs = document.querySelectorAll(`#${sectionId} [data-key]`)
    inputs.forEach((input) => {input.value = ''})
}

function saveForm () {
    let record = collectFormData()
    putRecord(record)
    countRecords()
}

function newRecord () {
    saveForm()
    currentRecord = null
    location.reload()
}

let addRecordButton = document.getElementById('add-record-button')
let exportCSVButton = document.getElementById('export-csv-button')
let clearRecordsButton = document.getElementById('clear-records-button')
let saveButton = document.getElementById('save-button')

addRecordButton.addEventListener('click', newRecord)
exportCSVButton.addEventListener('click', exportCSV)
clearRecordsButton.addEventListener('click', clearDatabase)
saveButton.addEventListener('click', saveForm)

countRecords()
