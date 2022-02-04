const fs = require('fs');

var is_auth = function(req)
{
    return (req.session
    && (req.session.user === "admin")
    && req.session.admin);
}

module.exports =
{
    async display_front_page(req, res, message = "")
    {
        var head = "";
        var nav = "";
        var mess = "";
        var end = "</body></html>";
        if(message)
        { 
            mess = `<div class="parag ccenter">` + message + `</div>`;
        }

        fs.readFile('templates/head.tpl', 'utf-8', (err, data) =>
        {
            if(err) { throw err; }
            head = data;
        });
        if(is_auth(req))
        {
            fs.readFile('templates/nav_auth.tpl', 'utf-8', (err, data) =>
            {
                if(err) { throw err; }
                nav = data;
            });
        }
        else
        {
            fs.readFile('templates/nav_guest.tpl', 'utf-8', (err, data) =>
            {
                if(err) { throw err; }
                nav = data;
            });
        }

        // wait for all files to load
        await new Promise(r => setTimeout(r, 20));

        var result = head + nav + mess + end;
        res.status(200).send(result);
    },

    async display_login_page(req, res)
    {
        var head = "";
        var nav = "";
        var form = "";
        var end = "</body></html>";

        fs.readFile('templates/head.tpl', 'utf-8', (err, data) =>
        {
            if(err) { throw err; }
            head = data;
        });
        if(is_auth(req))
        {
            fs.readFile('templates/nav_auth.tpl', 'utf-8', (err, data) =>
            {
                if(err) { throw err; }
                nav = data;
            });
        }
        else
        {
            fs.readFile('templates/nav_guest.tpl', 'utf-8', (err, data) =>
            {
                if(err) { throw err; }
                nav = data;
            });
        }
        fs.readFile('templates/login_form.tpl', 'utf-8', (err, data) =>
        {
            if(err) { throw err; }
            form = data;
        });

        // wait for all files to load
        await new Promise(r => setTimeout(r, 20));

        var result = head + nav + form + end;
        res.status(200).send(result);
    }
}
