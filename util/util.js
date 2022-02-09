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
        var head = await fs.promises.readFile('templates/head.tpl', { encoding: 'utf-8' });
        var nav_file = is_auth(req) ? 'templates/nav_auth.tpl' : 'templates/nav_guest.tpl';
        var nav = await fs.promises.readFile(nav_file, { encoding: 'utf-8' });
        var mess = (message) ? `<div class="parag ccenter">` + message + `</div>` : "";
        var about = await fs.promises.readFile('templates/about.tpl', { encoding: 'utf-8' });
        var footer = await fs.promises.readFile('templates/footer.tpl', { encoding: 'utf-8' });
        var end = "</body></html>";

        var result = head + nav + mess + about + footer + end;
        res.status(200).send(result);
    },

    async display_login_page(req, res)
    {
        var head = await fs.promises.readFile('templates/head.tpl', { encoding: 'utf-8' });
        var nav_file = is_auth(req) ? 'templates/nav_auth.tpl' : 'templates/nav_guest.tpl';
        var nav = await fs.promises.readFile(nav_file, { encoding: 'utf-8' });
        var form = await fs.promises.readFile('templates/login_form.tpl', { encoding: 'utf-8' });
        var end = "</body></html>";

        var result = head + nav + form + end;
        res.status(200).send(result);
    },

    async display_medical_form(req, res)
    {
        var head = await fs.promises.readFile('templates/head.tpl', { encoding: 'utf-8' });
        var nav_file = is_auth(req) ? 'templates/nav_auth.tpl' : 'templates/nav_guest.tpl';
        var nav = await fs.promises.readFile(nav_file, { encoding: 'utf-8' });
        var med_file = is_auth(req) ? 'templates/med_form_online.tpl' : 'templates/med_form_offline.tpl';
        var form = await fs.promises.readFile(med_file, { encoding: 'utf-8' });
        var end = "</body></html>";

        var result = head + nav + form + end;
        res.status(200).send(result);
    },

    async display_list(req, res, results)
    {
        var head = await fs.promises.readFile('templates/head.tpl', { encoding: 'utf-8' });
        var nav_file = is_auth(req) ? 'templates/nav_auth.tpl' : 'templates/nav_guest.tpl';
        var nav = await fs.promises.readFile(nav_file, { encoding: 'utf-8' });
        var table = "";
        for(const [date, health] of results)
        {
            table += `<div class='parag'><span class="bqaligned">Date: ${date}</span><blockquote>${health}</blockquote></div>`;
        }
        var footer = await fs.promises.readFile('templates/footer.tpl', { encoding: 'utf-8' });
        var end = "</body></html>";

        var result = head + nav + table + footer + end;
        res.status(200).send(result);
    },

    async display_return_info(req, res, message = "", status = 200)
    {
        var head = await fs.promises.readFile('templates/head.tpl', { encoding: 'utf-8' });
        var nav_file = is_auth(req) ? 'templates/nav_auth.tpl' : 'templates/nav_guest.tpl';
        var nav = await fs.promises.readFile(nav_file, { encoding: 'utf-8' });
        var mess = (message) ? `<div class="parag ccenter">` + message + `</div>` : "";
        var end = "</body></html>";

        var result = head + nav + mess + end;
        res.status(status).send(result);
    }
}
