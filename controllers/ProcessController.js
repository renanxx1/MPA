const ProcessService = require('../services/ProcessService');

class ProcessController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }


    async getCreate(req, res) {
        renderCreate(req, res, 200);
    }


    async setCreate(req, res) {
        var process = await ProcessService.setCreate(req.body.processNameInput, req.body.process_counterInput, req.body.process_counterCheckBox, req.body.processGoalInput, req.body.processGoalCheckBox)

        if (process == 1) {
            renderCreate(req, res, 201);
        } else {
            renderCreate(req, res, 406);
        }
    }


    async setDelete(req, res) {
        var process = await ProcessService.setDelete(req.params.id);

        if (process == 1) {
            renderIndex(req, res, 200);
        } else {
            renderIndex(req, res, 406);
        }
    }


    async getUpdate(req, res) {
        var id = req.params.id
        if (isNaN(id) || id == undefined) {
            res.redirect("/processos");
        } else {
            renderEdit(req, res, id, 200);
        }
    }


    async setUpdate(req, res) {
        var process = await ProcessService.setUpdate(req.body.id, req.body.processNameInput, req.body.process_counterInput, req.body.process_counterCheckBox, req.body.processGoalInput, req.body.processGoalCheckBox);
        if (process == 1) {
            renderEdit(req, res, req.params.id, 201);
        } else {
            renderEdit(req, res, req.params.id, 406);
        }
    }

}


async function renderIndex(req, res, code) {
    var processes = await ProcessService.getIndex();
    res.status(code).render('processes/index', {
        processes: processes,
        statusCode: code
    });
}


async function renderCreate(req, res, code) {
    res.status(code).render('processes/create', {
        statusCode: code
    });
}


async function renderEdit(req, res, id, code) {
    var process = await ProcessService.getUpdate(id);
    res.status(code).render('processes/edit', {
        process: process,
        statusCode: code
    });

}


module.exports = new ProcessController();