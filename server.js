// import { menu_with_message } from 'util/util.js';

// imports
const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const session = require('express-session');
const fs = require('fs');

var util = require('./util/util.js');

// database and app constants
var sdb;
const dbname = '9kluczka';
const host = '149.156.109.180'; // 149.156.109.180 - pascal.fis.agh.edu.pl
const url = 'mongodb://9kluczka:pass9kluczka@' + host + '/' + dbname;

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
        util.display_front_page(req, res, "login failed");
        // res.status(401).send("login failed");
    }
    else if((req.body.login === "admin")
    && (req.body.password === "admin"))
    {
        // set session
        req.session.user = "admin";
        req.session.admin = true;

        // connect to server database
        mongodb.MongoClient.connect(url, function(err, client)
        {
            if(err)
            {
                return console.log(err);
            }

            sdb = client.db(dbname);
            console.log('Database connection established.');
        });
        // TODO: sync client and server database
        util.display_front_page(req, res, "Login successful!");
    }
    else
    {
        res.status(401).send("login failed");
    }
});

app.get('/logout', function(req,res)
{
    req.session.destroy();
    util.display_front_page(req, res, "Logout successful!");
});
 

// app.get('/pomiary', function(req, res)
// {
//     client.query(`SELECT * FROM zad02.pomiar;`)
//     .then(qres =>
//     {
//         // console.log('Table is successfully created');
//         // console.log(qres);
//         var table = "";
//         for(let row of qres.rows)
//         {
//             var p = JSON.stringify(row);
//             p = JSON.parse(p);
//             table += `<div class="parag ccenter">ID: ` + p["id"] + `, czujnik: ` + p["czuj"] + `, temp: ` + p["temp"] + `, pres: ` + p["pres"] + `, time: ` + p["time"] + `</div>`;
//             // console.log(p["id_wydzial"]);
//             // res.send(row);
//         }
//         if(table == "")
//         {
//             table = "There are no results";
//         }
//         res.send(table);
//     })
//     .catch(err =>
//     {
//         console.error(err);
//     })
// });

// app.post('/pomiary', function( req,res )
// {
//     console.log(req.body)
    
//     .then(qres =>
//     {
//         console.log(qres);
//         var str = JSON.stringify(res);
//         str = JSON.parse(str);

//         client.query(`INSERT INTO zad02.czujnik(nazwa) values('` + str["nazwa"] `');`)
//     })
//     .catch(err =>
//     {
//         console.error(err);
//     })
// });

// app.delete('/pomiary/:czujnik',function(req, res)
// {
//     console.log(req.params.czujnik);
//     client.query(`DELETE FROM zad02.czujnik WHERE nazwa = '` + req.params.czujnik + `';`)
//     .then(qres =>
//     {
//         console.log(qres);
//     })
//     .catch(err =>
//     {
//         console.error(err);
//     })
// });

//     app.post('/pomiary/:czujnik', function( req,res )
// {
//     console.log(req.body)
//     var str = JSON.stringify(req.body);
//     str = JSON.parse(str);
//     console.log(str);

//     client.query(`INSERT INTO zad02.pomiar(czuj, temp, pres, time) values(
//         '` + req.params.czujnik + `', 
//         ` + str["temp"] + `,
//         ` + str["pres"] + `,
//         '` + str["time"] + `'::DATE);`
//     )
//     .then(qres =>
//     {
//         console.log(qres);
//     })
//     .catch(err =>
//     {
//         console.error(err);
//     })
// });

// app.get('/pomiary/:czujnik', function(req, res)
// {
//     client.query(`SELECT * FROM zad02.pomiar WHERE czuj = '` + req.params.czujnik + `';`)
//     .then(qres =>
//     {
//         // console.log('Table is successfully created');
//         // console.log(qres);
//         var table = "";
//         for(let row of qres.rows)
//         {
//             var p = JSON.stringify(row);
//             p = JSON.parse(p);
//             table += `<div class="parag ccenter">ID: ` + p["id"] + `, czujnik: ` + p["czuj"] + `, temp: ` + p["temp"] + `, pres: ` + p["pres"] + `, time: ` + p["time"] + `</div>`;
//             // console.log(p["id_wydzial"]);
//             // res.send(row);
//         }
//         if(table == "")
//         {
//             table = "There are no results";
//         }
//         res.send(table);
//     })
//     .catch(err =>
//     {
//         console.error(err);
//     })
// });

// app.get('/pomiary/:czujnik/:start/:stop', function(req, res)
// {
//     client.query(`SELECT * FROM zad02.pomiar WHERE czuj = '` + req.params.czujnik + `'
//         AND time > '` + req.params.start + `' AND time < '` + req.params.stop + `';`)
//     .then(qres =>
//     {
//         // console.log('Table is successfully created');
//         // console.log(qres);
//         var table = "";
//         for(let row of qres.rows)
//         {
//             var p = JSON.stringify(row);
//             p = JSON.parse(p);
//             table += `<div class="parag ccenter">ID: ` + p["id"] + `, czujnik: ` + p["czuj"] + `, temp: ` + p["temp"] + `, pres: ` + p["pres"] + `, time: ` + p["time"] + `</div>`;
//             // console.log(p["id_wydzial"]);
//             // res.send(row);
//         }
//         if(table == "")
//         {
//             table = "There are no results";
//         }
//         res.send(table);
//     })
//     .catch(err =>
//     {
//         console.error(err);
//     })
// });

// app.delete('/pomiary/:czujnik/:start/:stop',function(req, res)
// {
//     console.log(req.params.czujnik);
//     client.query(`DELETE FROM zad02.pomiar WHERE czuj = '` + req.params.czujnik + `'
//     AND time > '` + req.params.start + `' AND time < '` + req.params.stop + `';`)
//     .then(qres =>
//     {
//         console.log(qres);
//     })
//     .catch(err =>
//     {
//         console.error(err);
//     })
// });
