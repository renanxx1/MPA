const CollaboratorService = require('../services/CollaboratorService');

class CollaboratorController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }


    async getCreate(req, res) {
        renderCreate(req, res, 200);
    }


    async setCreate(req, res) {
        var collaborator = await CollaboratorService.setCreate(req.body.inputCollaborator, req.body.inputLogin, req.body.inputPassword, req.body.processSelectId, req.body.inputWorkTime)
        if (collaborator == 1) {
            renderCreate(req, res, 201);
        } else if (collaborator == 0) {
            renderCreate(req, res, 406);
        } else {
            renderCreate(req, res, 409);
        }
    }


    async setDelete(req, res) {
        await CollaboratorService.setDelete(req.params.id);
        res.redirect('/colaboradores');
    }


    async getUpdate(req, res) {
        var id = req.params.id;
        if (isNaN(id) || id == undefined) {
            res.redirect("/colaboradores");
        } else {
            renderEdit(req.params.id, res, 200);
        }
    }


    async setUpdate(req, res) {
        var collaborator = await CollaboratorService.setUpdate(req.params.id, req.body.inputCollaborator, req.body.inputLogin, req.body.inputPassword, req.body.processSelect, req.body.inputWorkTime);
        if (collaborator == 1) {
            renderEdit(req.params.id, res, 201);
        } else if (collaborator == 0) {
            renderEdit(req.params.id, res, 406);
        } else {
            renderEdit(req.params.id, res, 406);
        }
    }

}


async function renderIndex(req, res, code) {
    var collaborators = await CollaboratorService.getIndex();
    res.status(code).render('collaborators/index', {
        statusCode: code,
        collaborators: collaborators
    })
}

async function renderCreate(req, res, code) {
    var processes = await CollaboratorService.getCreate();
    res.status(code).render('collaborators/create', {
        statusCode: code,
        processes: processes
    })
}

async function renderEdit(req, res, code) {
    var get = await CollaboratorService.getUpdate(req);
    var processes = get.processes;
    var collaborator = get.collaborator;
    res.status(code).render('collaborators/edit', {
        statusCode: code,
        collaborator: collaborator,
        processes: processes
    });
}

module.exports = new CollaboratorController();
