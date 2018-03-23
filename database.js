let db

function initDB () {

    if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB. Please use a compatible browser.")
    }

    var request = window.indexedDB.open("MarineSpecimensData", 1)

    request.onerror = (event) => {
        console.error("You need to allow IndexedDB to use this application.")
    };

    request.onsuccess = (event) => {
        console.log("Using IndexedDB!")
        db = event.target.result
        db.onerror = function(event) {
            console.error("Database error: " + event.target.errorCode)
        };
    };

    request.onupgradeneeded = (event) => {
        console.log("Upgrading DB")
    }
}

