import Ajv from 'ajv'
import idb from 'idb'
import jsonSchema from '../assets/json/schema.json'
import csvHeaders from '../assets/json/headers.json'

// const jsonSchema = require('../assets/json/header.json')
// const csvHeaders = require('../assets/json/schema.json')


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

// function flatternObject (nestedObj, baseObj, prefix) {
//     for (var key in nestedObj){
//         var type = typeof nestedObj[key]
//         var flatKey = prefix + key

//         if (type === 'object'){
//             flatternObject(nestedObj[key], baseObj, flatKey)
//         } else if (type === 'array') {
//             flatternArray(nestedObj[key], baseObj, flatKey)
//         } else if ( type === 'undefined') {
//             continue
//         } else {
//             baseObj[flatKey] = nestedObj[key]
//         }

//     }
// }

// function flatternArray (nestedArray, baseObj, prefix) {
//     for (var i = 0; i < nestedArray.length; i++){
//         var type = typeof nestedObj[key]
//         var flatKey = prefix + i
//         if (type === 'object'){
//             flatternObject(nestedObj[key], baseObj, flatKey)
//         } else if (type === 'array') {
//             flatternArray(nestedObj[key], baseObj, flatKey)
//         } else if ( type === 'undefined') {
//             continue
//         } else {
//             baseObj[flatKey] = nestedArray[i]
//         }
//     }
// }

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
            result += record[eval("csvHeaders." + header)]
            firstElement = false
        })
        result += lineDelimiter
        firstElement = true
    })

    return result
}

function exportCSV () {
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

let addRecordButton = document.getElementById('add-record-button')
let exportCSVButton = document.getElementById('export-csv-button')

addRecordButton.addEventListener('click', putRecord)
exportCSVButton.addEventListener('click', exportCSV)