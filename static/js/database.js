import Ajv from "ajv";
import idb from "idb";
import jsonSchema from "../assets/json/schema.json";

let currentRecordId = null;
let ajv = new Ajv();
let jsonValidator = ajv.compile(jsonSchema);

function upgradeCallback(upgradeDb) {
  console.log("Upgrading IndexedDB");
  if (!upgradeDb.objectStoreNames.contains("records")) {
    upgradeDb.createObjectStore("records", {
      keyPath: "id",
      autoIncrement: true
    });
  }
}

let dbPromise = idb.open("AMNHMarineDatabase", 1, upgradeCallback);

export function putRecord(record) {
  if (!jsonValidator(record)) {
    console.error(jsonValidator.errors);
    return;
  }

  return dbPromise.then(db => {
    const tx = db.transaction("records", "readwrite");
    let objectStore = tx.objectStore("records");
    if (currentRecordId) {
      record.id = currentRecordId;
    }
    objectStore.put(record).then(id => {
      currentRecordId = id;
    });
    return tx.complete;
  });
}

export function getAllRecords() {
  return new Promise((resolve, reject) => {
    dbPromise
      .then(db => {
        return db
          .transaction("records")
          .objectStore("records")
          .getAll();
      })
      .then(data => {
        resolve(data);
      });
  });
}

export function clearDatabase() {
  return dbPromise.then(db => {
    const tx = db.transaction("records", "readwrite");
    tx.objectStore("records").clear();
    return tx.complete;
  });
}

export function getRecord(recordId) {
  return dbPromise.then(db => {
    return db
      .transaction("records")
      .objectStore("records")
      .get(recordId);
  });
}

export function deleteRecord(recordId) {
  return dbPromise.then(db => {
    const tx = db.transaction("records", "readwrite");
    tx.objectStore("records").delete(recordId);
    return tx.complete;
  });
}
