// imports
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const util = require('./util/util.js');

// database setup
var sdb;
var ldb = new sqlite3.Database(':memory:', (err) =>
{
    if(err) { return console.error(err.message); }
    console.log('Local connection established.');
});
ldb.run(`CREATE TABLE med(date text, health text);`, [], (err) =>
{
    if(err) { return console.log(err.message); }
    console.log(`Local database created.`);
});

// app configuration
const app = express();
const port = 2789;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session(
{
    secret: 'very-secret',
    resave: true,
    saveUninitialized: true
}));

// authorization and authentication
var is_auth = function(req)
{
    return(req.session
    && (req.session.user === "admin")
    && req.session.admin);
}

// start server
app.listen(port, function()
{
    console.log('Express server listening on port ' + port);
});

// resources
app.get('/css/style.css', function(req, res)
{
    res.sendFile(__dirname + '/css/style.css');
});

app.get('/r/css/style.css', function(req, res) // for raw api messages
{
    res.sendFile(__dirname + '/css/style.css');
});

// shiny rest api
app.get('/', function(req, res)
{
    util.display_front_page(req, res);
});

app.get('/login', function(req, res)
{
    if(is_auth(req))
    {
        fs.readFile('templates/redirect.tpl', 'utf-8', (err, data) =>
        {
            if(err) { throw err; }
            res.status(301).send(data);
        });
    }
    else
    {
        util.display_login_page(req, res);
    }
});

app.post('/login', function(req, res)
{
    console.log(req.body);
    if(!req.body.login || !req.body.password)
    {
        util.display_front_page(req, res, "Login failed.");
        // res.status(401).send("login failed");
    }
    else if((req.body.login === "admin")
    && (req.body.password === "admin"))
    {
        // set session
        req.session.user = "admin";
        req.session.admin = true;

        // connect to the remote database
        sdb = new sqlite3.Database('sql/dbase.db', (err) =>
        {
            if(err) { return console.error(err.message); }
            console.log('Remote connection established.');
        });

        // sync client and server databases
        ldb.all(`SELECT date, health FROM med;`, [], (err, rows) =>
        {
            // var result = [];
            var query = "INSERT INTO med(date, health) VALUES";
            if(err) { throw err; }
            if(rows.length > 0)
            {
                // constructing the query
                rows.forEach((row) =>
                {
                    query += `('${row.date}', '${row.health}'), `;
                });
                query = query.slice(0, -2);
                query += ';';

                // synchronizing remote database
                sdb.run(query, [], (err) =>
                {
                    if(err) { return console.log(err.message); }
                    console.log(`Inserted ${rows.length} rows to the remote database!`);
                });

                // clearing local database
                ldb.run(`DELETE FROM med;`, [], (err) =>
                {
                    if(err) { throw err; }
                    console.log(`Local database cleared!`);
                    console.log(`Sync successful!`);
                });
            }
            else
            {
                console.log(`No need to sync - there's no local data.`);
            }
        });

        util.display_front_page(req, res, "Login successful!");
    }
    else
    {
        util.display_front_page(req, res, "Login failed.");
    }
});

app.get('/logout', function(req,res)
{
    req.session.destroy();
    if(is_auth(req))
    {
        sdb.close((err) =>
        {
            if(err) { return console.error(err.message); }
            console.log('Closed the database connection.');
        });
        util.display_front_page(req, res, "Logout successful!");
    }
    else
    {
        fs.readFile('templates/redirect.tpl', 'utf-8', (err, data) =>
        {
            if(err) { throw err; }
            res.status(301).send(data);
        });
    }
});

///////////////////////////////////////////////////////////////////////////////////

app.get('/new', function(req, res)
{
    util.display_medical_form(req, res);
    // res.status(200).send(result);
});

app.post('/new', function(req, res)
{
    const now = new Date(Date.now());
    let day = (now.getDate() > 9) ? `${now.getDate()}` : `0${now.getDate()}`;
    let month = (now.getMonth()+1 > 9) ? `${now.getMonth()+1}` : `0${now.getMonth()+1}`;
    let seconds = (now.getSeconds() > 9) ? `${now.getSeconds()}` : `0${now.getSeconds()}`;
    let minutes = (now.getMinutes() > 9) ? `${now.getMinutes()}` : `0${now.getMinutes()}`;
    let hours = (now.getHours() > 9) ? `${now.getHours()}` : `0${now.getHours()}`;
    req.body.date = `${now.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // online -> remote database
    // offline -> local database
    const db = is_auth(req) ? sdb : ldb;
    const message = is_auth(req) ? "Added a new health status to the remote database." : "Added a new health status to the local database.";

    db.run(`INSERT INTO med(date, health) VALUES(?, ?)`, [req.body.date, req.body.description], (err) =>
    {
        if(err) { return console.log(err.message); }
        console.log(`A row has been inserted with date ${req.body.date}`);
    });

    util.display_front_page(req, res, message);
});

app.get('/list', function(req, res)
{
    var result = [];
    const db = is_auth(req) ? sdb : ldb;
    const message = is_auth(req) ? "There are no records in the remote database." : "There are no records in the local database.";

    db.all(`SELECT date, health FROM med;`, [], (err, rows) =>
    {
        if(err) { throw err; }
        rows.forEach((row) => { result.push([`${row.date}`, `${row.health}`]); });
        if(result.length > 0)
        {
            util.display_list(req, res, result);
        }
        else
        {
            // util.display_front_page(req, res, message);
            util.display_return_info(req, res, message);
        }
    });
});

// raw rest api, available only for remote database
app.get('/r/list', function(req, res)
{
    if(is_auth(req))
    {
        sdb.all(`SELECT date, health FROM med;`, [], (err, rows) =>
        {
            if(err) { throw err; }
            if(rows.length > 0)
            {
                console.log(`RAW API 200: Returning ${rows.length} results.`);
                res.status(200).send(rows);
            }
            else
            {
                console.log(`RAW API 200: No contents found.`);
                res.status(200).send("No contents.");
            }
        });
    }
    else
    {
        util.display_return_info(req, res, "Unauthorized access, please log in to get read access to raw API.", 401);
    }
});

app.get('/r/list/:byear/:bmonth/:bday', function(req, res)
{
    // format must be yyyy/mm/dd
    if(is_auth(req))
    {
        sdb.all(`SELECT date, health FROM med WHERE date > '${req.params.byear}-${req.params.bmonth}-${req.params.bday}';`,
            [], (err, rows) =>
        {
            if(err) { throw err; }
            if(rows.length > 0)
            {
                console.log(`RAW API 200: Returning ${rows.length} results.`);
                res.status(200).send(rows);
            }
            else
            {
                console.log(`RAW API 200: No contents found.`);
                res.status(200).send("No contents.");
            }
        });
    }
    else
    {
        util.display_return_info(req, res, "Unauthorized access, please log in to get read access to raw API.", 401);
    }
});

app.get('/r/list/:byear/:bmonth/:bday/:eyear/:emonth/:eday', function(req, res)
{
    // format must be yyyy/mm/dd
    if(is_auth(req))
    {
        sdb.all(`SELECT date, health FROM med WHERE date > '${req.params.byear}-${req.params.bmonth}-${req.params.bday}' 
            AND date < '${req.params.eyear}-${req.params.emonth}-${req.params.eday}';`,
            [], (err, rows) =>
        {
            if(err) { throw err; }
            if(rows.length > 0)
            {
                console.log(`RAW API 200: Returning ${rows.length} results.`);
                res.status(200).send(rows);
            }
            else
            {
                console.log(`RAW API 200: No contents found.`);
                res.status(200).send("No contents.");
            }
        });
    }
    else
    {
        util.display_return_info(req, res, "Unauthorized access, please log in to get read access to raw API.", 401);
    }
});

app.delete('/r/list', function(req, res)
{
    if(is_auth(req))
    {
        sdb.get(`DELETE FROM med;`, [], (err) =>
        {
            if(err) { throw err; }
            console.log(`RAW API 200: Removed all rows.`);
            res.status(200).send(`All rows removed.`);
        });
    }
    else
    {
        util.display_return_info(req, res, "Unauthorized access, please log in to get access to raw API.", 401);
    }
});

app.delete('/r/list/:byear/:bmonth/:bday', function(req, res)
{
    // format must be yyyy/mm/dd
    if(is_auth(req))
    {
        sdb.get(`DELETE FROM med WHERE date > '${req.params.byear}-${req.params.bmonth}-${req.params.bday}';`,
            [], (err) =>
        {
            if(err) { throw err; }
            console.log(`RAW API 200: Removed some rows.`);
            res.status(200).send("Removed some rows.");
        });
    }
    else
    {
        util.display_return_info(req, res, "Unauthorized access, please log in to get access to raw API.", 401);
    }
});

app.delete('/r/list/:byear/:bmonth/:bday/:eyear/:emonth/:eday', function(req, res)
{
    // format must be yyyy/mm/dd
    if(is_auth(req))
    {
        sdb.get(`DELETE FROM med WHERE date > '${req.params.byear}-${req.params.bmonth}-${req.params.bday}' 
            AND date < '${req.params.eyear}-${req.params.emonth}-${req.params.eday}';`,
            [], (err) =>
        {
            if(err) { throw err; }
            console.log(`RAW API 200: Removed some rows.`);
            res.status(200).send("Removed some rows.");
        });
    }
    else
    {
        util.display_return_info(req, res, "Unauthorized access, please log in to get access to raw API.", 401);
    }
});

////////////////////////////////////////////////////////////////////////////////////////////
