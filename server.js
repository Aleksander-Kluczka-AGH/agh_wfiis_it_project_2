// imports
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const util = require('./util/util.js');

// database
var sdb;

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

// rest api
app.get('/', function(req, res)
{
    util.display_front_page(req, res);
});

app.get('/login', function(req, res)
{
    util.display_login_page(req, res);
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

        // connect to server database
        sdb = new sqlite3.Database('sql/dbase.db', (err) =>
        {
            if(err) { return console.error(err.message); }
            console.log('Connection established.');
        });

        // TODO: sync client and server database
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
    sdb.close((err) =>
    {
        if(err) { return console.error(err.message); }
        console.log('Closed the database connection.');
    });

    util.display_front_page(req, res, "Logout successful!");
});

///////////////////////////////////////////////////////////////////////////////////

app.get('/new', function(req, res)
{
    // result = pug.renderFile('templates/survey.pug');
    util.display_medical_form(req, res);
    // res.status(200).send(result);
});

app.post('/new', function(req, res)
{
    const now = new Date(Date.now());
    req.body.date = `${now.getFullYear()}
                    /${now.getMonth()+1}
                    /${now.getDate()}
                    _${now.getHours()}
                    /${now.getMinutes()}
                    /${now.getSeconds()}`;

    if(is_auth(req)) // online
    {        
        sdb.run(`INSERT INTO med(date, health) VALUES(?, ?)`, [req.body.date, req.body.description], (err) =>
        {
            if(err) { return console.log(err.message); }
            console.log(`A row has been inserted with date ${req.body.date}`);
        });

        // sdb.close((err) =>
        // {
        //     if(err) { return console.error(err.message); }
        //     console.log('Closed the database connection.');
        // });

        util.display_front_page(req, res, "Added a new health status successfully.");
    }
    else // offline
    {
        util.display_front_page(req, res, "Please login to insert new medical records.");
        // res.status(401).send("Zaloguj się aby to wysłać.");
    }
});

app.get('/list', function(req, res)
{
    var result = [];
    if(is_auth(req)) // online
    {
        sdb.all(`SELECT date, health FROM med;`, [], (err, rows) =>
        {
            if(err) { throw err; }
            console.log('pre:');
            rows.forEach((row) =>
            {
                console.log(`${row.date}`);
                result.push([`${row.date}`, `${row.health}`]);
            });
            console.log('outside:');
            for(const [date, health] of result)
            {
                console.log(`date = ${date}, health = ${health}`);
            }
            util.display_list(req, res, result);
        });
    }
    else // offline
    {
        util.display_front_page(req, res, "Please login in order to see medical history.");
    }
});

// app.get('/survey_results_offline', function(req, res)
// {
//     if(!req.session.admin)
//     {
//     //    result = pug.renderFile('templates/survey_results_offline.pug');
//     //    res.status(200).send(result);
//     }
//     else
//     {
//         res.status(401).send("Wyloguj się aby zobaczyć wyniki offline.");
//     }
// });

////////////////////////////////////////////////////////////////////////////////////////////
