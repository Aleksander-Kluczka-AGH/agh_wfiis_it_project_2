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
        var about = "";
        var footer = "";
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
        fs.readFile('templates/about.tpl', 'utf-8', (err, data) =>
        {
            if(err) { throw err; }
            about = data;
        });
        fs.readFile('templates/footer.tpl', 'utf-8', (err, data) =>
        {
            if(err) { throw err; }
            footer = data;
        });

        // wait for all files to load
        await new Promise(r => setTimeout(r, 20));

        var result = head + nav + mess + about +footer + end;
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
    },

    async display_medical_form(req, res)
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
            // console.log("Displaying online form."); // DEBUG
            fs.readFile('templates/med_form_online.tpl', 'utf-8', (err, data) =>
            {
                if(err) { throw err; }
                form = data;
            });
        }
        else
        {
            fs.readFile('templates/nav_guest.tpl', 'utf-8', (err, data) =>
            {
                if(err) { throw err; }
                nav = data;
            });
            // console.log("Displaying offline form."); // DEBUG
            fs.readFile('templates/med_form_offline.tpl', 'utf-8', (err, data) =>
            {
                if(err) { throw err; }
                form = data;
            });
        }

        // fs.readFile('templates/med_form.tpl', 'utf-8', (err, data) =>
        // {
        //     if(err) { throw err; }
        //     form = data;
        // });

        // wait for all files to load
        await new Promise(r => setTimeout(r, 20));

        var result = head + nav + form + end;
        res.status(200).send(result);
    },

    async display_list(req, res, results)
    {
        var head = "";
        var nav = "";
        var table = "";
        var footer = "";
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

        fs.readFile('templates/footer.tpl', 'utf-8', (err, data) =>
        {
            if(err) { throw err; }
            footer = data;
        });

        for(const [date, health] of results)
        {
            table += `<div class='parag'><span class="bqaligned">Date: ${date}</span><blockquote>${health}</blockquote></div>`;
        }

        // wait for all files to load
        await new Promise(r => setTimeout(r, 20));

        var result = head + nav + table + footer + end;
        res.status(200).send(result);
    },

    async display_return_info(req, res, message = "", status = 200)
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
        res.status(status).send(result);
    }
}
