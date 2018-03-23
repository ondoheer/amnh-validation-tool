function initDB () {
    if (!window.indexedDB) {
        window.alert('Your browser doesnt support a stable version of IndexedDB. Please use a compatible browser.')
    }

    var request = window.indexedDB.open('MarineDatabase', 1)

    request.onerror = (event) => {
        console.error('You need to allow IndexedDB to use this application.')
    };

    request.onsuccess = (event) => {
        console.log('Using IndexedDB!')
        db = event.target.result
        db.onerror = function(event) {
            console.error('Database error: ' + event.target.errorCode)
        };
    };

    request.onupgradeneeded = (event) => {
        console.log('Creating/Upgrading DB')
        db = event.target.result
        db.createObjectStore('records',  {keyPath: 'id', autoIncrement: true})
    }
}

function addRecord (record) {
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

initDB()