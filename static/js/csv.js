import csvHeaders from '../assets/json/headers.json'
import {kebabToCamel} from './helpers.js'
import {getAllRecords} from './database.js'

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

export function exportCSV () {
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
