const AdminService = require('../services/AdminService');

class AdminController {

    async adminIndexGet(req, res) {
        renderIndex(req, res, 200);
    }

    async adminCreateGet(req, res) {
        renderCreate(req, res, 200);
    }

    async adminCreatePost(req, res) {
        var admin = await AdminService.adminCreatePost(req.body.login, req.body.password);
        if (admin == 1) {
            renderCreate(req, res, 201);
        } else if (admin == 0) {
            renderCreate(req, res, 406);
        } else {
            renderCreate(req, res, 409);
        }
    }

    async adminDeletePost(req, res) {
        await AdminService.adminDeletePost(req.params.id);
        res.redirect('/admin')
    }

    async adminUpdateGet(req, res) {
        var id = req.params.id;
        if (isNaN(id) || id == undefined) {
            res.redirect("/admin");
        } else {
            renderEdit(req, res, id, 200);
        }
    }

    async adminUpdatePost(req, res) {
        var admin = await AdminService.adminUpdatePost(req.body.id, req.body.login, req.body.password, req.body.gridRadios)
        if (admin == 1) {
            renderEdit(req, res, req.params.id, 201);
        } else if (admin == 0) {
            renderEdit(req, res, req.params.id, 406);
        } else {
            renderEdit(req, res, req.params.id, 409);
        }

    }
}

async function renderIndex(req, res, code) {
    var admins = await AdminService.adminIndexGet();
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

async function renderEdit(req, res, id, code) {
    var admin = await AdminService.adminUpdateGet(id);
    res.status(code).render('admins/edit', {
        statusCode: code,
        admin: admin
    });
}



module.exports = new AdminController();