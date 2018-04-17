import { kebabToCamel } from "./helpers.js";
import { determinedByPeople, collectors, donors } from "./add_person.js";
import { getAllRecords, clearDatabase, putRecord } from "./database.js";
import { getUser } from "./register_user";

const recordTally = document.getElementById("num_records");

function countRecords() {
  getAllRecords().then(records => {
    recordTally.innerHTML = records.length;
  });
}

function generateTrackingNumber() {
  var date = new Date(Date.now());
  var name = getUser();
  return `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${name}`;
}

function getSection(sectionId) {
  let sectionData = {};
  let inputs = document.querySelectorAll(`#${sectionId} [data-key]`);
  inputs.forEach(input => {
    if (input.type === "radio") {
      if (input.checked)
        sectionData[kebabToCamel(input.dataset.key)] = input.value;
    } else if (input.value !== "") {
      sectionData[kebabToCamel(input.dataset.key)] = input.value;
    }
  });
  return sectionData;
}

function collectFormData() {
  let record = {
    recordData: getSection("tracking-data"),
    taxonomy: getSection("taxonomy-data"),
    determinedBy: getSection("determined-by-data"),
    specimenData: getSection("specimen-data"),
    hostData: getSection("host-data"),
    collectionData: getSection("collection-data"),
    locationData: getSection("location-data"),
    donationData: getSection("donation-data")
  };
  if (record.hostData.hasHost === "no") record.hostData = { hasHost: "no" };
  record.recordData.trackingNumber = generateTrackingNumber();
  record.determinedBy.people = determinedByPeople.getPeople();
  record.collectionData.collectors = collectors.getPeople();
  record.donationData.donors = donors.getPeople();
  return record;
}

export function clearRecords() {
  const clearConfirm = confirm(
    "This will delete all the previously added Records, make sure you have already exported them to a CSV or don't need them. Do you want to delete the records?"
  );
  if (clearConfirm) {
    clearDatabase().then(() => {
      countRecords();
    });
  }
}

export function saveRecord() {
  let record = collectFormData();
  putRecord(record);
  countRecords();
}

export function newRecord() {
  saveRecord();
  location.reload();
}

countRecords();
