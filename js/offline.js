var db;
var req = indexedDB.open('db', 1);

// initialize local database
req.onupgradeneeded = function(event)
{
    db = event.target.result;
    db.createObjectStore('med');
    // console.log("Local database created."); // DEBUG
};

req.onsuccess = function(event)
{
	db = event.target.result;
};

req.onerror = function(event)
{
	console.log("Error creating local database: code " + event.target.errorCode);
};

// form management
function readAnswers()
{
    var form = document.getElementById("med_form_offline");
    var description = form.description;
    var date = form.date;

    if(date.value.length == 0)
    {
        const now = new Date(Date.now());
        let day = (now.getDate() > 9) ? `${now.getDate()}` : `0${now.getDate()}`;
        let month = (now.getMonth()+1 > 9) ? `${now.getMonth()+1}` : `0${now.getMonth()+1}`;
        let seconds = (now.getSeconds() > 9) ? `${now.getSeconds()}` : `0${now.getSeconds()}`;
        let minutes = (now.getMinutes() > 9) ? `${now.getMinutes()}` : `0${now.getMinutes()}`;
        let hours = (now.getHours() > 9) ? `${now.getHours()}` : `0${now.getHours()}`;
        date.value = `${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    if(description.value.length != 0)
    {
        newRecord(date.value, description.value);
    }
    else
    {
        console.log("Description field is empty, failed to add the new record.");
    }
}

function newRecord(date, description)
{
    // console.log(`date: ${date}, desc: ${description}`); // DEBUG

    var trans = db.transaction(["med"], "readwrite");
    var store = trans.objectStore("med");
    // trans.oncomplete = () => { console.log("Transaction complete."); }; // DEBUG
    trans.onerror = (event) => { console.log("Transaction error: ", event); }

    var req = store.add(description, date);
    // req.onsuccess = (event) => { console.log("Addition successful."); }; // DEBUG
    req.onerror = (event) => { console.log("Addition failed: ", event); };

    window.location.replace("/");
}

function clearLocalData(name)
{
    var trans = db.transaction(name, "readwrite");
    var store = trans.objectStore(name);

    store.clear();
    // trans.oncomplete = () => { console.log("Local storage cleared."); }; // DEBUG
    trans.onerror = (event) =>  { console.log("Error clearing local storage."); }
}

function sendToRemote()
{
    readData('med', sendToRemoteCallback);
}

function readData(name, callback)
{
    var trans = db.transaction(name, "readwrite");
    var store = trans.objectStore(name);

    var data = [];
    store.openCursor().onsuccess = (event) =>
    {
        var cursor = event.target.result;
        if(cursor)
        {
            // console.log({"date": cursor.key, "description": cursor.value}); // DEBUG
            data.push({'date': `${cursor.key}`, 'description': `${cursor.value}`});
            // console.log("last = " + data[data.length-1]); // DEBUG
            cursor.continue();
        }
    };

    trans.oncomplete = () => { callback(data); };
    trans.onerror = (event) => { console.log("Error reading local data."); };
}

function sendToRemoteCallback(data)
{
    // console.log("data = " + data); // DEBUG
    for(var row of data)
    {
        // console.log("row = " + row); // DEBUG
        fetch("/new",
        {
            method: "POST",
            headers: {"Content-type": "application/json;charset=utf-8"},
            body: JSON.stringify(row)
        })
        // .then((response) => { console.log("Local data sent to the remote database."); }) // DEBUG
        .catch((error) => { console.log("Error on sending local data: ", error); });
        clearLocalData('med');
    }
}
