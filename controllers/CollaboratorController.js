const CollaboratorService = require('../services/CollaboratorService');

class CollaboratorController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }


    async getCreate(req, res) {
        renderCreate(req, res, 200);
    }


    async setCreate(req, res) {
        var collaboratorData = {
            collaborator_name: req.body.inputCollaborator,
            login: req.body.inputLogin,
            password: req.body.inputPassword,
            process_id: req.body.processSelectId,
            work_time: req.body.inputWorkTime
        }

        var result = await CollaboratorService.setCreate(collaboratorData);
        if (result == 1) {
            renderCreate(req, res, 201);
        } else if (result == 0) {
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
            renderEdit(id, res, 200);
        }
    }


    async setUpdate(req, res) {
        var collaboratorData = {
            id: req.params.id,
            collaborator_name: req.body.inputCollaborator,
            login: req.body.inputLogin,
            password: req.body.inputPassword,
            process_id: req.body.processSelect,
            work_time: req.body.inputWorkTime,
            admin_on: req.body.inputAdminOnOff
        }

        var result = await CollaboratorService.setUpdate(collaboratorData);
        if (result == 1) {
            renderEdit(collaboratorData.id, res, 201);
        } else if (result == 2) {
            res.redirect('/admin')
        } else {
            renderEdit(collaboratorData.id, res, 406);
        }
    }

}


async function renderIndex(req, res, code) {
    var collaborators = await CollaboratorService.getIndex();
    res.status(code).render('collaborators/CollaboratorIndex', {
        statusCode: code,
        collaborators: collaborators
    })
}


async function renderCreate(req, res, code) {
    try {
        var processes = await CollaboratorService.getCreate();
        res.status(code).render('collaborators/CollaboratorCreate', {
            statusCode: code,
            processes: processes
        });

    } catch (error) {
        res.redirect('/colaboradores');
    }
}


async function renderEdit(req, res, code) {
    try {
        var get = await CollaboratorService.getUpdate(req);
        var processes = get.processes;
        var collaborator = get.collaborator;
        res.status(code).render('collaborators/CollaboratorEdit', {
            statusCode: code,
            collaborator: collaborator,
            processes: processes
        });

    } catch (error) {
        res.redirect('/colaboradores');
    }

}


module.exports = new CollaboratorController();
