const ProcessService = require('../services/ProcessService');

class ProcessController {

    async processIndexGet(req, res) {
        renderIndex(req, res, 200);
    }

    async processCreateGet(req, res) {
        renderCreate(req, res, 200);
    }

    async processCreatePost(req, res) {
        var process = await ProcessService.processCreatePost(req.body.processNameInput, req.body.process_counterInput, req.body.process_counterCheckBox, req.body.processGoalInput, req.body.processGoalCheckBox)

        if (process == 1) {
            renderCreate(req, res, 201);
        } else {
            renderCreate(req, res, 406);
        }
    }

    async processDeletePost(req, res) {
        var process = await ProcessService.processDeletePost(req.params.id);

        if (process == 1) {
            renderIndex(req, res, 200);
        } else {
            renderIndex(req, res, 406);
        }
    }

    async processUpdateGet(req, res) {
        var id = req.params.id
        if (isNaN(id) || id == undefined) {
            res.redirect("/processos");
        } else {
            renderEdit(req, res, id, 200);
        }
    }

    async processUpdatePost(req, res) {
        var process = await ProcessService.processUpdatePost(req.body.id, req.body.processNameInput, req.body.process_counterInput, req.body.process_counterCheckBox, req.body.processGoalInput, req.body.processGoalCheckBox);
        if (process == 1) {
            renderEdit(req, res, req.params.id, 201);
        } else {
            renderEdit(req, res, req.params.id, 406);
        }
    }
}

async function renderIndex(req, res, code) {
    var processes = await ProcessService.processIndexGet();
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
    var process = await ProcessService.processUpdateGet(id);
    res.status(code).render('processes/edit', {
        process: process,
        statusCode: code
    });

}


module.exports = new ProcessController();