import {newRecord, saveRecord, clearRecords} from './records.js'
import {exportCSV} from './csv.js'

const hostYesRadio = document.getElementById("host-yes");
const hostNoRadio = document.getElementById("host-no");
const newRecordButton = document.getElementById('add-record-button')
const saveButton = document.getElementById('save-button')
const exportCSVButton = document.getElementById('export-csv-button')
const clearRecordsButton = document.getElementById('clear-records-button')
const hostSection = document.getElementById("optionalHostInfo")

hostYesRadio.addEventListener("click", () => {
  hostSection.classList.remove("u-hidden")
})

hostNoRadio.addEventListener("click", () => {
  hostSection.classList.add("u-hidden")
})

newRecordButton.addEventListener('click', newRecord)
saveButton.addEventListener('click', saveRecord)
exportCSVButton.addEventListener('click', exportCSV)
clearRecordsButton.addEventListener('click', clearRecords)
