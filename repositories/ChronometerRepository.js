const Activity_Chronometer = require('../models/Activity_Chronometer');
const { Op } = require("sequelize");
const moment = require('moment');

class ChronometerRepository {

    async createChronometer(activity_id, time, counter, collaborator_id) {
        return await
            Activity_Chronometer.create({
                activity_id: activity_id,
                time: time,
                counter: counter,
                collaborator_id: collaborator_id
            })
    }

    async setChronometer(activity_id, time, counter, collaborator_id) {
        return await
            Activity_Chronometer.update({
                time: time,
                counter: counter
            }, {
                where: {
                    [Op.and]: [{
                        activity_id: activity_id,
                        collaborator_id: collaborator_id
                    }]
                }
            })
    }

        async findByCollaboratorInDay(collaborator_id) {
        return await
            Activity_Chronometer.findOne({
                where: {
                    collaborator_id: activity_name,

                    [Op.and]: [{
                        createdAt: moment(),
                    }]
                }
            });
    }

}

module.exports = new ChronometerRepository();