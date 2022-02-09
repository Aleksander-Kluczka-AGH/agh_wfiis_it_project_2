var target = document.getElementById("data_list");

function execute()
{
    return new Promise((resolve, reject) =>
    {
        var req = indexedDB.open('db', 1);
        req.onerror = (event) => { reject(Error("Error creating local database: code " + event.target.errorCode)); };

        req.onupgradeneeded = (event) =>
        {
            event.target.transaction.abort();
            reject(Error("Local database not found."));
        };

        req.onsuccess = function(event)
        {
            var db = event.target.result;
            var trans = db.transaction("med", "readonly");
            var store = trans.objectStore("med");
            var obj_req = store.openCursor();
            var data = [];
            obj_req.onsuccess = (event) =>
            {
                var cursor = event.target.result;
                if(cursor)
                {
                    data.push(cursor.key + "&" + cursor.value);
                    cursor.continue();
                }
            };
            trans.oncomplete = () =>
            {
                if(data)
                {
                    resolve(data);
                }
                else
                {
                    reject(Error("No results returned."));
                }
            }
        };
    });
}

execute()
.then((res) =>
{
    if(res.length > 0)
    {
        for(var row of res)
        {
            var temp = row.split('&');
            var date = temp[0];
            var description = temp[1];
            target.innerHTML += `<div class='parag'><span class="bqaligned">Date: ${date}</span><blockquote>${description}</blockquote></div>`;
        }
    }
    else
    {
        target.innerHTML = `<div class='parag ccenter'>There are no records in the local database.</div>`;
    }
})
.catch((error) => { console.log("Error: ", error); });
