const ActivityService = require('../services/ActivityService');

class ActivityController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }


    async getCreate(req, res) {
        renderCreate(req, res, 200);
    }


    async setCreate(req, res) {
        var activityData = {
            activity_name: req.body.activityNameInput,
            process_id: req.body.processSelect,
            group_name: req.body.groupSelect
        }

        var result = await ActivityService.setCreate(activityData);
        if (result == 1) {
            renderCreate(req, res, 201);
        } else {
            renderCreate(req, res, 406);
        }
    }


    async setDelete(req, res) {
        var result = await ActivityService.setDelete(req.params.id);
        if (result == 1) {
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
            renderEdit(id, res, 200);
        }
    }


    async setUpdate(req, res) {
        var activityData = {
            id: req.params.id,
            activity_name: req.body.activityNameInput,
            process_id: req.body.processSelect,
            group_name: req.body.groupSelect,
        }

        var result = await ActivityService.setUpdate(activityData);
        if (result == 1) {
            renderEdit(activityData.id, res, 201);
        } else if (result == 0) {
            renderEdit(activityData.id, res, 406);
        } else {
            renderEdit(activityData.id, res, 409);
        }
    }

}

async function renderIndex(req, res, code) {
    var activities = await ActivityService.getIndex();
    res.status(code).render('activities/ActivityIndex', {
        activities: activities,
        statusCode: code
    })
}


async function renderCreate(req, res, code) {
    try {
        var get = await ActivityService.getCreate();
        var processes = get.processes;
        var groups = get.groups;
        var activities = get.activities;
    
        res.status(code).render('activities/ActivityCreate', {
            statusCode: code,
            processes: processes,
            groups: groups,
            activities: activities
        })
  
    } catch (error) {
        res.redirect("/atividades");
    }
 
}

async function renderEdit(req, res, code) {
    try {
        var get = await ActivityService.getUpdate(req);
        var processes = get.processes;
        var activity = get.activity;
        var groups = get.groups;
        var activities = get.activities;

        res.status(code).render('activities/ActivityEdit', {
            statusCode: code,
            activity: activity,
            processes: processes,
            groups: groups,
            id: req,
            activities: activities
        });
  
    } catch (error) {
        res.redirect("/atividades");
    }

}


module.exports = new ActivityController()