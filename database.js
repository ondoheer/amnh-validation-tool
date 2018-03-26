let jsonValidator
let db

function initDB () {
    if (!window.indexedDB) {
        window.alert('Your browser doesnt support a stable version of IndexedDB. Please use a compatible browser.')
    }

    var request = window.indexedDB.open('AMNHMarineDatabase', 1)

    request.onerror = (event) => {
        console.error('You need to allow IndexedDB to use this application.')
    };

    request.onsuccess = (event) => {
        console.log('Using IndexedDB')
        db = event.target.result
        db.onerror = function(event) {
            console.error('Database error: ' + event.target.errorCode)
        };
    };

    request.onupgradeneeded = (event) => {
        console.log('Upgrading IndexedDB')
        db = event.target.result
        db.createObjectStore('records',  {keyPath: 'id', autoIncrement: true})
    }
}

function addRecord (record) {
    if (!jsonValidator(record)){
        console.error(jsonValidator.errors)
        return
    }

    var transaction = db.transaction(['records'], 'readwrite')
    transaction.oncomplete = (event) => {
        console.log('Transaction all done!')
    }
      
    transaction.onerror = (event) => {
        console.error('Bad transaction')
    }
    
    var objectStore = transaction.objectStore('records')
    var request = objectStore.add(record)

    request.onsuccess = (event) => {
        console.log('Record added!')
    }

    request.onerror = (event) => {
        console.error('Whomp whomp no record added.')
    }
}

function loadJSON(file, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 loadJSON("schema.json", function(response) {
   let schema = JSON.parse(response)
   let ajv = new Ajv()
   jsonValidator = ajv.compile(schema)
 })  

 initDB()