const ActivityService = require('../services/ActivityService');

class ActivityController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }


    async getCreate(req, res) {
        renderCreate(req, res, 200);
    }


    async setCreate(req, res) {
        var activity = await ActivityService.setCreate(req.body.activityNameInput, req.body.processSelect, req.body.agroupCheckBox, req.body.groupSelect);
        if (activity == 1) {
            renderCreate(req, res, 201);
        } else {
            renderCreate(req, res, 406);
        }
    }


    async setDelete(req, res) {
        var activity = await ActivityService.setDelete(req.params.id);
        if (activity == 1) {
            renderIndex(req, res, 201);
        } else {
            renderIndex(req, res, 406);
        }
    }


    async getUpdate(req, res) {
        var id = req.params.id;
        if (isNaN(id) || id == undefined) {
            res.redirect("/atividades");
        } else {
            renderEdit(req.params.id, res, 200);
        }
    }


    async setUpdate(req, res) {
        var activity = await ActivityService.setUpdate(req.body.activityNameInput, req.body.processSelect, req.body.agroupCheckBox, req.body.groupSelect, req.params.id);
        if (activity == 1) {
            renderEdit(req.params.id, res, 201);
        } else if (activity == 0) {
            renderEdit(req.params.id, res, 406);
        } else {
            renderEdit(req.params.id, res, 409);
        }
    }

}

async function renderIndex(req, res, code) {
    var activities = await ActivityService.getIndex();
    res.status(code).render('activities/index', {
        activities: activities,
        statusCode: code
    })
}


async function renderCreate(req, res, code) {
    var get = await ActivityService.getCreate();
    var processes = get.processes;
    var groups = get.groups;
    var activities = get.activities;

    res.status(code).render('activities/create', {
        statusCode: code,
        processes: processes,
        groups: groups,
        activities: activities
    })
}

async function renderEdit(req, res, code) {
    var get = await ActivityService.getUpdate(req);
    var processes = get.processes;
    var activity = get.activity;
    var groups = get.groups;
    var activities = get.activities;

    res.status(code).render('activities/edit', {
        statusCode: code,
        activity: activity,
        processes: processes,
        groups: groups,
        id: id,
        activities: activities
    });
}


module.exports = new ActivityController()