const Activity = require('../models/Activity');
const Group = require('../models/Group');
const Collaborator = require('../models/Collaborator');
const Activity_Chronometer = require('../models/Activity_Chronometer');
const Process = require('../models/Process');
const Process_Counter = require('../models/Process_Counter');
const Checkpoint = require('../models/Checkpoint');

const {
    Op
} = require("sequelize");
const moment = require('moment');


class CollectorRepository {

    async findCollaboratorAndProcess(id) {
        return await
            Collaborator.findOne({
                raw: true,
                nest: true,
                attributes: ['id', 'login', 'work_time', 'process_id'],
                where: {
                    [Op.and]: [{
                        id: id,
                        status: true
                    }]
                },
                include: [{
                    model: Process,
                }],
            })
    }

    async findActivityByProcessId(process_id) {
        return await
            Activity.findAll({
                raw: true,
                attributes: ['id'],
                where: {
                    [Op.and]: [{
                        process_id: process_id,
                        status: true
                    }]
                }
            })
    }

    async findOneActivity(activity_id) {
        return await
            Activity.findOne({
                raw: true,
                where: {
                    [Op.and]: [{
                        id: activity_id,
                    }]
                }
            })
    }

    async findAllChronometers(collaborator_id) {
        return await
            Activity_Chronometer.findAll({
                where: {
                    [Op.and]: [{
                        collaborator_id: collaborator_id,
                        createdAt: moment().format('YYYY-MM-DD')
                    }]
                }
            })
    }

    async findAllActivitiesAndChronometers(collaborator_id, process_id) {
        return await
            Activity.findAll({
                include: [{
                    model: Activity_Chronometer,
                    where: {
                        [Op.and]: [{
                            collaborator_id: collaborator_id,
                            process_id: process_id,
                            createdAt: moment().format('YYYY-MM-DD'),
                        }],
                    }
                }],
            })
    }

    async findIdleTime(collaborator_id, process_id) {
        return await
            Activity_Chronometer.findOne({
                raw: true,
                nest: true,
                where: {
                    [Op.and]: [{
                        activity_id: null,
                        collaborator_id: collaborator_id,
                        process_id: process_id,
                        createdAt: moment().format('YYYY-MM-DD'),
                    }],
                }
            })
    }

    async findGroups(process_id) {
        return await
            Activity.findAll({
                include: [{
                    model: Group
                }],
                where: {
                    [Op.and]: [{
                        process_id: process_id,
                        group_id: {
                            [Op.not]: null
                        }
                    }],
                }
            })
    }

    async findAllActivitiesAndChronometersOnlyId(collaborator_id, process_id) {
        return await
            Activity_Chronometer.findAll({
                attributes: ['activity_id'],
                raw: true,
                where: {
                    [Op.and]: [{
                        collaborator_id: collaborator_id,
                        process_id: process_id,
                        createdAt: moment().format('YYYY-MM-DD'),
                        activity_id: {
                            [Op.not]: null
                        }
                    }]
                },
            })
    }


    async createChronometer(time, work_time, counter, activity_id, collaborator_id, process_id) {
        return await
            Activity_Chronometer.create({
                time: time,
                work_time: work_time,
                counter: counter,
                activity_id: activity_id,
                collaborator_id: collaborator_id,
                process_id: process_id
            })
    }

    async setChronometer(time, counter, activity_id, collaborator_id) {
        return await
            Activity_Chronometer.update({
                time: time,
                counter: counter,
            }, {
                where: {
                    [Op.and]: [{
                        collaborator_id: collaborator_id,
                        activity_id: activity_id,
                        createdAt: moment().format('YYYY-MM-DD')
                    }]
                },
            })
    }

    async findOneChronometer(activity_id, collaborator_id) {
        return await Activity_Chronometer.findOne({
            where: {
                [Op.and]: [{
                    activity_id: activity_id,
                    createdAt: moment().format('YYYY-MM-DD'),
                    collaborator_id: collaborator_id
                }]
            }
        })
    }

    async createCounter(counter, process_counter, process_id, collaborator_id, daily_goal) {
        return await
            Process_Counter.create({
                counter: counter,
                process_counter: process_counter,
                process_id: process_id,
                collaborator_id: collaborator_id,
                daily_goal: daily_goal
            })
    }

    async setCounter(counter, process_id, collaborator_id) {
        return await
            Process_Counter.update({
                counter: counter
            }, {
                where: {
                    [Op.and]: [{
                        process_id: process_id,
                        collaborator_id: collaborator_id,
                        createdAt: moment().format('YYYY-MM-DD')
                    }]
                }
            })
    }


    async findProcessAndCounter(collaborator_id, process_id) {
        return await
            Process.findOne({
                where: {
                    id: process_id,
                },
                include: [{
                    model: Process_Counter,
                    where: {
                        [Op.and]: [{
                            collaborator_id: collaborator_id,
                            createdAt: moment().format('YYYY-MM-DD')
                        }]
                    }
                }]
            })
    }

    async findCheckPoint(chronometer_id) {
        var check = await Checkpoint.findOne({
            raw: true,
            nest: true,
            where: {
                [Op.and]: [{
                    chronometer_id: chronometer_id,
                    createdAt: moment().format('YYYY-MM-DD')
                }]
            }
        })
        return check;
    }

    async findCheckPointByCollaborator(collaborator_id, process_id) {
        return await
            Activity_Chronometer.findOne({
                include: [{
                    model: Checkpoint,
                    where: {
                        [Op.and]: [{
                            collaborator_id: collaborator_id,
                            process_id: process_id,
                            createdAt: moment().format('YYYY-MM-DD')
                        }]
                    }
                }]
            })
    }

    async createCheckPoint(collaborator_id, chronometer_id, process_id) {
        return await
            Checkpoint.create({
                collaborator_id: collaborator_id,
                chronometer_id: chronometer_id,
                process_id: process_id
            })
    }

    async deleteCheckPoint(chronometer_id) {
        return await
            Checkpoint.destroy({
                where: {
                    [Op.and]: [{
                        chronometer_id: chronometer_id,
                        createdAt: moment().format('YYYY-MM-DD')
                    }]
                }
            })
    }

    async deleteAllCheckPoint(collaborator_id) {
        return await
            Checkpoint.destroy({
                where: {
                    collaborator_id: collaborator_id
                }
            })
    }

}

module.exports = new CollectorRepository();