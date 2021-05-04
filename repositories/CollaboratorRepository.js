const Collaborator = require('../models/Collaborator');
const Collaborator_History = require('../models/Collaborator_History');
const Admin = require('../models/Admin');
const Process = require('../models/Process');
const Activity_Chronometer = require('../models/Activity_Chronometer');
const { Op } = require("sequelize");

class CollaboratorRepository {

    async findAll() {
        return await Collaborator.findAll({
            raw: true,
            nest: true,
            include: [{
                model: Process
            }],
            where: {
                status: true
            }
        });
    }

    async findAllProcesses() {
        return await Process.findAll({
            where: {
                status: true
            }
        });
    }

    async findOneByLoginOrName(collaborator_name, login) {
        return await Collaborator.findOne({
            where: {
                status: true,
                [Op.or]: [{
                    login: login
                }, {
                    collaborator_name: collaborator_name
                }]
            }
        })
    }

    async findAdminByLogin(login) {
        return await Admin.findOne({
            where: {
                login: login
            }
        })
    }


    async createCollaborator(collaborator_name, login, hash, process, work_time) {
        return await Collaborator.create({
            collaborator_name: collaborator_name,
            login: login,
            password: hash,
            process_id: process,
            work_time: work_time,
            status: true,
        })
    }



    async findOneByName(collaborator_name) {
        return await Collaborator.findOne({
            where: {
                collaborator_name: collaborator_name,
            }
        })
    }

    async findOneByNameOrLoginNotSameId(collaborator_name, login, id) {
        return await
            Collaborator.findOne({
                where: {
                    [Op.or]: [{
                        collaborator_name: collaborator_name,
                        login: login
                    }],
                    [Op.and]: [{
                        id: { [Op.not]: id },
                        status: true
                    }]
                }
            })
    }

    async findCollaboratorByPk(id) {
        return await
            Collaborator.findByPk(id);
    }

    async updateCollaboratorNoPassword(id, collaborator_name, login, process_id, work_time) {
        return await Collaborator.update({
            collaborator_name: collaborator_name,
            login: login,
            process_id: process_id,
            work_time: work_time
        }, {
            where: {
                id: id
            }
        });
    }

    async updateCollaboratorWithPassword(id, collaborator_name, login, hash, process_id, work_time) {
        return await Collaborator.update({
            collaborator_name: collaborator_name,
            login: login,
            password: hash,
            process_id: process_id,
            work_time: work_time
        }, {
            where: {
                id: id
            }
        });
    }

    async deleteCollaborator(id) {
        return await Collaborator.destroy({
            where: {
                id: id
            }
        })
    }

    async findByPk(id) {
        return await Collaborator.findByPk(id);
    }


    async findChronometer(collaborator_id) {
        return await Activity_Chronometer.findOne({
            where: {
                collaborator_id: collaborator_id
            }
        });
    }


    async updateCollaboratorStatus(id) {
        return await
            Collaborator.update({
                status: false,
            }, {
                where: { id: id }
            })
    }
}

module.exports = new CollaboratorRepository();