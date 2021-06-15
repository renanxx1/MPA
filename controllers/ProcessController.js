const ProcessService = require('../services/ProcessService');

class ProcessController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }


    async getCreate(req, res) {
        renderCreate(req, res, 200);
    }


    async setCreate(req, res) {
        var processData = {
            process_name: req.body.processNameInput,
            process_counter: req.body.process_counterInput,
            process_counterCheck: req.body.process_counterCheckBox,
            process_goal: req.body.processGoalInput,
            process_goalCheck: req.body.processGoalCheckBox
        }

        var result = await ProcessService.setCreate(processData);
        if (result == 1) {
            renderCreate(req, res, 201);
        } else {
            renderCreate(req, res, 406);
        }
    }


    async setDelete(req, res) {
        var result = await ProcessService.setDelete(req.params.id);

        if (result == 1) {
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
            renderEdit(id, res, 200);
        }
    }


    async setUpdate(req, res) {
        var processData = {
            id: req.body.id,
            process_name: req.body.processNameInput,
            process_counter: req.body.process_counterInput,
            process_counterCheck: req.body.process_counterCheckBox,
            process_goal: req.body.processGoalInput,
            process_goalCheck: req.body.processGoalCheckBox
        }

        var process = await ProcessService.setUpdate(processData);
        if (process == 1) {
            renderEdit(req.params.id, res, 201);
        } else {
            renderEdit(req.params.id, res, 406);
        }
    }

}


async function renderIndex(req, res, code) {
    var processes = await ProcessService.getIndex();
    res.status(code).render('processes/ProcessIndex', {
        processes: processes,
        statusCode: code
    });
}


async function renderCreate(req, res, code) {
    res.status(code).render('processes/ProcessCreate', {
        statusCode: code
    });
}


async function renderEdit(id, res, code) {
    try {
        var process = await ProcessService.getUpdate(id);
        if (process == null) { res.redirect('/processos'); }
        res.status(code).render('processes/ProcessEdit', {
            process: process,
            statusCode: code
        });

    } catch (error) {
        res.redirect('/processos');
    }
}


module.exports = new ProcessController();