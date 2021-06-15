const AdminService = require('../services/AdminService');

class AdminController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }


    async getCreate(req, res) {
        renderCreate(req, res, 200);
    }


    async setCreate(req, res) {
        var adminData = {
            admin_name: req.body.inputAdministrator,
            login: req.body.inputLogin,
            password: req.body.inputPassword
        }

        var result = await AdminService.setCreate(adminData);
        if (result == 1) {
            renderCreate(req, res, 201);
        } else if (result == 0) {
            renderCreate(req, res, 406);
        }
    }


    async setDelete(req, res) {
        await AdminService.setDelete(req.params.id);
        res.redirect('/admin')
    }


    async getUpdate(req, res) {
        var id = req.params.id;
        if (isNaN(id) || id == undefined) {
            res.redirect("/admin");
        } else {
            renderEdit(id, res, 200);
        }
    }


    async setUpdate(req, res) {
        var adminData = {
            id: req.body.id,
            admin_name: req.body.inputAdministrator,
            login: req.body.inputLogin,
            password: req.body.inputPassword,
            admin_on: req.body.inputAdminOnOff,
            process_id: req.body.processSelect,
            work_time: req.body.inputWorkTime
        }

        var result = await AdminService.setUpdate(adminData);

        if (result == 1) {
            renderEdit(adminData.id, res, 201);
        } else if (result == 0) {
            renderEdit(adminData.id, res, 406);
        } else if (result == 2) {
            res.redirect('/colaboradores')
        } else {
            renderEdit(adminData.id, res, 409);
        }
    }

}


async function renderIndex(req, res, code) {
    var admins = await AdminService.getIndex();
    res.status(code).render('admins/AdminIndex', {
        statusCode: code,
        admins: admins
    })
}


async function renderCreate(req, res, code) {
    try {
        res.status(code).render('admins/AdminCreate', {
            statusCode: code
        });

    } catch (error) {
        res.redirect('/admins')
    }
}


async function renderEdit(req, res, code) {
    try {
        var get = await AdminService.getUpdate(req);
        var admin = get.admin;
        var processes = get.processes;
        res.status(code).render('admins/AdminEdit', {
            statusCode: code,
            admin: admin,
            processes: processes
        });

    } catch (error) {
        res.redirect('/admins')
    }

}



module.exports = new AdminController();