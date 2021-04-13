const Process = require('../models/Process');
const Activity = require('../models/Activity');
const Collaborator = require('../models/Collaborator');
const {
    Op
} = require("sequelize");

class ProcessRepository {

    async findAll() {
        return await
            Process.findAll({
                include: [{
                    model: Activity
                }]
            });
    }

    async findOneByName(process_name) {
        return await
            Process.findOne({
                where: {
                    [Op.and]: [{
                        process_name: process_name,
                        status: true
                    }]
                }
            })
    }

    async findCollaboratorsInProcess(id) {
        return await
            Collaborator.findOne({
                where: {
                    [Op.and]: [{
                        process_id: id,
                        status: true
                    }]
                }
            })
    }


    async findOneByNameNotSameId(id, process_name) {
        return await
            Process.findOne({
                where: {
                    [Op.and]: [{
                        process_name: process_name,
                        status: true
                    },
                    {
                        [Op.not]: [{
                            id: id,
                        }]
                    }
                    ],
                }
            })
    }

    async createProcess(process_name) {
        return await
            Process.create({
                process_name: process_name,
                status: true
            })
    }

    async createProcessAndCounterAndGoal(process_name, process_counter, daily_goal) {
        return await
            Process.create({
                process_name: process_name,
                process_counter: process_counter,
                daily_goal: daily_goal,
                status: true
            })
    }

    async updateProcess(id, process_name) {
        return await
            Process.update({
                process_name: process_name,
            }, {
                where: {
                    id: id
                }
            });
    }

    async updateProcessAndCounterAndGoal(id, process_name, process_counter, daily_goal) {
        return await
            Process.update({
                process_name: process_name,
                process_counter: process_counter,
                daily_goal: daily_goal
            }, {
                where: {
                    id: id
                }
            });
    }

    async deleteProcess(id) {
        return await
            Process.destroy({
                where: {
                    id: id
                }
            })
    }

    async findByPk(id) {
        return await
            Process.findByPk(id);
    }

    async findActivitiesInProcess(id) {
        return await
            Activity.findAll({
                where: {
                    [Op.and]: [{
                        process_id: id,
                        status: true
                    }]
                }
            })
    }


    async findActivitiesInProcessStatusFalse(id) {
        return await
            Activity.findAll({
                where: {
                    [Op.and]: [{
                        process_id: id,
                        status: false
                    }]
                }
            })
    }

    async updateProcessStatus(id) {
        return await
            Process.update({
                status: false,
            }, {
                where: {
                    id: id
                }
            })
    }
}

module.exports = new ProcessRepository();