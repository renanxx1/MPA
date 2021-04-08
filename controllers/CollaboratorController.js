const CollaboratorService = require('../services/CollaboratorService');

class CollaboratorController {

    async collaboratorIndexGet(req, res) {
        renderIndex(req, res, 200);
    }

    async collaboratorCreateGet(req, res) {
        renderCreate(req, res, 200);
    }

    async collaboratorCreatePost(req, res) {
        var collaborator = await CollaboratorService.collaboratorCreatePost(req.body.inputCollaborator, req.body.inputLogin, req.body.inputPassword, req.body.processSelectId, req.body.inputWorkTime)
        if (collaborator == 1) {
            renderCreate(req, res, 201);
        } else if (collaborator == 0) {
            renderCreate(req, res, 406);
        } else {
            renderCreate(req, res, 409);
        }
    }

    async collaboratorDeletePost(req, res) {
        await CollaboratorService.collaboratorDeletePost(req.params.id);
        res.redirect('/colaboradores');
    }

    async collaboratorUpdateGet(req, res) {
        var id = req.params.id;
        if (isNaN(id) || id == undefined) {
            res.redirect("/colaboradores");
        } else {
            renderEdit(req, res, id, 200);
        }
    }

    async collaboratorUpdatePost(req, res) {
        var collaborator = await CollaboratorService.collaboratorUpdatePost(req.params.id, req.body.inputCollaborator, req.body.inputLogin, req.body.inputPassword, req.body.processSelect,  req.body.inputWorkTime);
        if (collaborator == 1) {
            renderEdit(req, res, req.params.id, 201);
        } else if (collaborator == 0) {
            renderEdit(req, res, req.params.id, 406);
        } else {
            renderEdit(req, res, req.params.id, 406);
        }
    }


}


async function renderIndex(req, res, code) {
    var collaborators = await CollaboratorService.collaboratorIndexGet();
    res.status(code).render('collaborators/index', {
        statusCode: code,
        collaborators: collaborators
    })
}

async function renderCreate(req, res, code) {
    var processes = await CollaboratorService.collaboratorCreateGet();
    res.status(code).render('collaborators/create', {
        statusCode: code,
        processes: processes
    })
}

async function renderEdit(req, res, id, code) {
    var get = await CollaboratorService.collaboratorUpdateGet(id);
    var processes = get.processes;
    var collaborator = get.collaborator;
    res.status(code).render('collaborators/edit', {
        statusCode: code,
        collaborator: collaborator,
        processes: processes
    });
}

module.exports = new CollaboratorController();
