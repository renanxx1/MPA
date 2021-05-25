const AdminService = require('../services/AdminService');

class AdminController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }


    async getCreate(req, res) {
        renderCreate(req, res, 200);
    }


    async setCreate(req, res) {
        var admin = await AdminService.setCreate(req.body.inputAdministrator, req.body.inputLogin, req.body.inputPassword);
        if (admin == 1) {
            renderCreate(req, res, 201);
        } else if (admin == 0) {
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
            renderEdit(req.params.id, res, 200);
        }
    }


    async setUpdate(req, res) {
       
        var admin = await AdminService.setUpdate(req.body.id, req.body.inputAdministrator, req.body.inputLogin, req.body.inputPassword, req.body.inputAdminOnOff, req.body.processSelect, req.body.inputWorkTime)
console.log(admin)
        if (admin == 1) {
            renderEdit(req.params.id, res, 201);
        } else if (admin == 0) {
            renderEdit(req.params.id, res, 406);
        } else if (admin == 2) {
            res.redirect('/colaboradores')
        } else {
            renderEdit(req.params.id, res, 409);
        }
    }

}


async function renderIndex(req, res, code) {
    var admins = await AdminService.getIndex();
    res.status(code).render('admins/index', {
        statusCode: code,
        admins: admins
    })
}


async function renderCreate(req, res, code) {
    res.status(code).render('admins/create', {
        statusCode: code
    });

}


async function renderEdit(req, res, code) {
    var get = await AdminService.getUpdate(req);
    var admin = get.admin;
    var processes = get.processes;
    res.status(code).render('admins/edit', {
        statusCode: code,
        admin: admin,
        processes: processes
    });
}



module.exports = new AdminController();