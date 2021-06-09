const Activity = require('../models/Activity');
const Process = require('../models/Process');
const Group = require('../models/Group');
const Activity_Chronometer = require('../models/Activity_Chronometer');
const moment = require('moment')
const groupPrefix = 'G_';
const { Op } = require("sequelize");

class ActivityRepository {

    async findAll() {
        return await
            Activity.findAll({
                include: [{
                    model: Process,
                }, {
                    model: Group,
                }],
                where: {
                    status: true
                }
            });
    }



    async findGroupByName(activity_name) {
        return await
            Group.findOne({
                raw: true,
                where: {
                    group_name: groupPrefix + activity_name
                }
            })
    }


    async findActivityGroupByName(activity_name, process_id) {
        return await
            Activity.findOne({
                include: [{
                    all: true,
                }],
                where: {
                    [Op.and]: [{
                        process_id: process_id,
                        activity_name: activity_name,
                        status: true
                    }]
                }
            })
    }

    async findOneIncludeAll(id) {
        return await
            Activity.findOne({
                include: [{
                    all: true
                }],
                where: {
                    [Op.and]: {
                        id: id,
                        status: true
                    }
                }
            });
    }


    async findActivityByNameAndProcessAndId(activity_name, process_id, id) {
        return await
            Activity.findOne({
                where: {
                    [Op.and]: [{
                        activity_name: activity_name,
                        process_id: process_id,
                        status: true,
                    }],
                    [Op.not]: [{
                        id: id
                    }]
                }
            })
    }

    async findActivityByNameAndProcess(activity_name, process_id) {
        return await
            Activity.findOne({
                where: {
                    activity_name: activity_name,
                    [Op.and]: [{
                        process_id: process_id,
                        status: true,
                    }]
                }
            })
    }



    async findActivtyByGroupId(group_id) {
        var activities = await
            Activity.findAll({
                where: {
                    [Op.and]: [{
                        group_id: group_id,
                        status: true
                    }]
                }
            })
        if (activities[0].group_id == null) {
            activities = undefined
        }
        return activities;
    }

    async findAllProcesses() {
        return await
            Process.findAll({
                where: {
                    status: true
                }
            });
    }


    async findGroupAndActivity() {
        return await
            Group.findAll({
                include: [{
                    all: true,
                    where: {
                        status: true
                    }
                }]
            });
    }

    async findChronometer(activity_id) {
        return await
            Activity_Chronometer.findOne({
                where: {
                    activity_id: activity_id,
                }
            })
    }

    async findByNameAndFilterByIdProcess(activity_name, process_id, id) {
        return await
            Activity.findOne({
                where: {
                    id: { [Op.ne]: id },
                    [Op.and]: [{
                        activity_name: activity_name,
                        status: true,
                        process_id: process_id
                    }],
                }
            });
    }


    async createActivity(activity_name, group_id, process_id) {
        return await
            Activity.create({
                activity_name: activity_name,
                process_id: process_id,
                group_id: group_id,
                status: true
            });
    }

    async deleteActivity(id) {
        return await
            Activity.destroy({
                where: {
                    id: id
                }
            });
    };

    async deleteActivityAndGroup(id, group_id) {
        await
            Activity.destroy({
                where: {
                    id: id
                }
            });
        await Group.destroy({
            where: {
                id: group_id
            }
        })
    };


    async agroupableUpdateActivityAndCreateGroup(group_activity, activity_name, process_id) {
        var hour = moment().format("YYYY-MM-DD HH:mm:ss");
        var getHour = hour.slice(0, 18);
        var sumSec = parseInt(hour.slice(18, 19)) + 2;
        var newHour = moment(getHour + sumSec).format("YYYY-MM-DD HH:mm:ss")

        var group = await
            Group.create({
                group_name: groupPrefix + group_activity
            })
        await Activity.update({
            group_id: group.id,
            createdAt: hour
        }, {
            where: {
                [Op.and]: [{
                    activity_name: group_activity,
                    process_id: process_id,
                    status: true,
                }]
            }
        })
        await Activity.create({
            activity_name: activity_name,
            process_id: process_id,
            group_id: group.id,
            status: true,
            createdAt: newHour
        });
        return true;
    }


    async agroupUpdateActivitiesAndCreateGroup(group_activity, activity_name, process_id, id) {
        var hour = moment().format("YYYY-MM-DD HH:mm:ss");
        var getHour = hour.slice(0, 18);
        var sumSec = parseInt(hour.slice(18, 19)) + 2;
        var newHour = moment(getHour + sumSec).format("YYYY-MM-DD HH:mm:ss")

        var group = await
            Group.create({
                group_name: groupPrefix + group_activity
            })
        await Activity.update({
            group_id: group.id,
            createdAt: hour
        }, {
            where: {
                [Op.and]: [{
                    activity_name: group_activity,
                    process_id: process_id,
                    status: true
                }]
            }
        });

        await Activity.update({
            activity_name: activity_name,
            process_id: process_id,
            group_id: group.id,
            createdAt: newHour
        }, {
            where: {
                [Op.and]: [{
                    id: id,
                    process_id: process_id,
                    status: true,
                }]
            }
        })

        return true;
    }



    async agroupActivityAndCreate(group_id, activity_name, process_id) {
        return await
            Activity.create({
                activity_name: activity_name,
                process_id: process_id,
                group_id: group_id,
                status: true,
            })
    }


    async agroupActivityUpdate(activity_name, process_id, group_id, id) {
        return await
            Activity.update({
                activity_name: activity_name,
                process_id: process_id,
                group_id: group_id
            }, {
                where: {
                    [Op.and]: [{
                        id: id,
                        status: true
                    }]
                }
            })
    }

    async agroupUpdateActivityAndGroup(activity_name, process_id, group_id, id) {
        await
            Activity.update({
                activity_name: activity_name,
            }, {
                where: {
                    [Op.and]: [{
                        id: id,
                        status: true
                    }]
                }
            })
        await Group.update({
            group_name: groupPrefix + activity_name
        }, {
            where: {
                id: group_id
            }
        })
    }


    async agroupUpdateActivityProcessAndGroup(activity_name, process_id, group_id, id) {
        await
            Activity.update({
                activity_name: activity_name,
                process_id: process_id,
                group_id: group_id
            }, {
                where: {
                    [Op.and]: [{
                        id: id,
                        status: true
                    }]
                }
            })
        await Group.update({
            group_name: groupPrefix + activity_name
        }, {
            where: {
                id: group_id
            }
        })
    }

    async agroupDestroyGroupAndUpdateActivity(activity_name, process_id, group_id, group, id) {
        await
            Group.destroy({
                where: {
                    id: group_id
                }
            })
        await
            Activity.update({
                activity_name: activity_name,
                process_id: process_id,
                group_id: group
            }, {
                where: {
                    id: id
                }
            })
        return true;
    }

    async noCheckActivityUpdateGroupNull(activity_name, groupNull, process_id, id) {
        return await
            Activity.update({
                activity_name: activity_name,
                process_id: process_id,
                group_id: groupNull
            }, {
                where: {
                    [Op.and]: [{
                        id: id,
                        status: true
                    }]
                }
            })
    }

    async noCheckGroupDelete(group_id) {
        return await
            Group.destroy({
                where: {
                    id: group_id
                }
            })
    }

    async updateActivityStatus(id) {
        return await
            Activity.update({
                status: false,
            }, {
                where: { id: id }
            })
    }


    async updateActivityAndDeleteGroup(id, group_id) {
        Activity.update({
            status: false,
        }, {
            where: { id: id }
        })
        await Group.destroy({
            where: {
                id: group_id
            }
        })
    }
}

module.exports = new ActivityRepository();