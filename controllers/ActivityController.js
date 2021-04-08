const ActivityService = require('../services/ActivityService');
class ActivityController {

    async activityIndexGet(req, res) {
        renderIndex(req, res, 200);
    }


    async activityCreateGet(req, res) {
        renderCreate(req, res, 200);
    }


    async activityCreatePost(req, res) {
        var activity = await ActivityService.activityCreatePost(req.body.activityNameInput, req.body.processSelect, req.body.agroupCheckBox, req.body.groupSelect);
        if (activity == 1) {
            renderCreate(req, res, 201);
        } else {
            renderCreate(req, res, 406);
        }
    }


    async activityDeletePost(req, res) {
        var activity = await ActivityService.activityDeletePost(req.params.id);
        if (activity == 1) {
            renderIndex(req, res, 201);
        } else {
            renderIndex(req, res, 406);
        }
    }


    async activityUpdateGet(req, res) {
        var id = req.params.id;
        if (isNaN(id) || id == undefined) {
            res.redirect("/atividades");
        } else {
            renderEdit(req, res, id, 200);
        }
    }


    async activityUpdatePost(req, res) {
        var activity = await ActivityService.activityUpdatePost(req.body.activityNameInput, req.body.processSelect, req.body.agroupCheckBox, req.body.groupSelect, req.params.id);
        if (activity == 1) {
            renderEdit(req, res, req.params.id, 201);
        } else if (activity == 0) {
            renderEdit(req, res, req.params.id, 406);
        } else {
            renderEdit(req, res, req.params.id, 409);
        }
    }

}

async function renderIndex(req, res, code) {
    var activities = await ActivityService.activityIndex();
    res.status(code).render('activities/index', {
        activities: activities,
        statusCode: code
    })
}


async function renderCreate(req, res, code) {
    var get = await ActivityService.activityCreateGet();
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

async function renderEdit(req, res, id, code) {
    var get = await ActivityService.activityUpdateGet(id);
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