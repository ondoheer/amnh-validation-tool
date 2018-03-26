import Ajv from 'ajv'
import idb from 'idb'
const jsonSchema = require('./schema.json')
const csvHeaders = require('./headers.json')


function upgradeCallback (upgradeDb) {
    console.log('Upgrading IndexedDB')
    if (!upgradeDb.objectStoreNames.contains('records')) {
        upgradeDb.createObjectStore('records',  {keyPath: 'id', autoIncrement: true})
    }
}

let db = idb.open('AMNHMarineDatabase', 1, upgradeCallback)
let ajv = new Ajv()
let jsonValidator = ajv.compile(jsonSchema)

function putRecord (record) {
    if (!jsonValidator(record)){
        console.error(jsonValidator.errors)
        return
    }

    return dbPromise.then(db => {
        const tx = db.transaction('records', 'readwrite')
        tx.objectStore('records').put(record)
        return tx.complete
    })
}

function getRecord (recordId) {
    return dbPromise.then(db => {
        return db.transaction('records').objectStore('records').get(recordId)
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

function recordsToCSV () {
    let records
    let columnDelimiter = ','
    let lineDelimiter = '\n'
    let result = ''
    let firstElement = true

    dbPromise.then(db => {
        return db.transaction('records').objectStore('records').getAll()
    }).then(items => records = items)

    if (records == null || !records.length) {
        return null;
    }

    let headers = Object.keys(csvHeaders)
    result += headers.join(columnDelimiter) + lineDelimiter

    records.forEach(record => {
        headers.forEach(header => {
            if (!firstElement) result += columnDelimiter
            result += record[csvHeaders[header]]
            firstElement = false
        })
        result += lineDelimiter
        firstElement = true
    })

    return result
}

function exportCVS () {
    var data, filename, link;
    var csvString = recordsToCSV()
    if (csvString == null) return

    filename = 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csvString
    }
    data = encodeURI(csvString)

    link = document.createElement('a')
    link.setAttribute('href', data)
    link.setAttribute('download', filename)
    link.click()
}