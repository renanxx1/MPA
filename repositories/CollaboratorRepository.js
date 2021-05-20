const Collaborator = require('../models/Collaborator');
const Collaborator_History = require('../models/Collaborator_History');
//const Admin = require('../models/Admin');
const Process = require('../models/Process');
const Activity_Chronometer = require('../models/Activity_Chronometer');
const { Op } = require("sequelize");

class CollaboratorRepository {

    async findAllCollaborator() {
        return await Collaborator.findAll({
            raw: true,
            nest: true,
            include: [{
                model: Process
            }],
            where: {
                [Op.and]:[{
                    admin:false,
                    status: true
                }]
            }
        });
    }

    async findAllAdmin() {
        return await Collaborator.findAll({
            raw: true,
            nest: true,
            where: {
                [Op.and]: [{
                    admin: true,
                    status: true
                }]
            }
        });
    }

    async findCollaboratorByLogin(admin_name, login) {
        return await
            Collaborator.findOne({
                where: {
                    status: true,
                    [Op.or]: [{
                        login: login
                    }, {
                        collaborator_name: admin_name
                    }]
                }
            })
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

    async findOneByLoginOrNameAdmin(collaborator_name, login) {
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
        return await Collaborator.findOne({
            where: {
                [Op.and]: [{
                    login: login,
                    admin: true,
                    status: true
                }]
            }
        })
    }


    async findAdminByLogin(login) {
        return await Collaborator.findOne({
            where: {
                login: login
            }
        })
    }


    async createCollaborator(collaborator_name, login, hash, process, work_time) {
        return await
            Collaborator.create({
                collaborator_name: collaborator_name,
                login: login,
                password: hash,
                process_id: process,
                work_time: work_time,
                admin: false,
                status: true,
            })
    }

    async createAdmin(admin_name, login, hash) {
        return await
            Collaborator.create({
                collaborator_name: admin_name,
                login: login,
                password: hash,
                process_id: null,
                work_time: null,
                admin: true,
                status: true,
            })
    }

    async findOneAdminOrCollaborator(admin_name, login, id) {
        return await
            Collaborator.findOne({
                where: {
                    id: { [Op.not]: id },
                    [Op.or]: [
                        { login: login },
                        { collaborator_name: admin_name },
                    ],
                }
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

    async findByPk(id) {
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


    async updateAdminLogin(admin_name, login, id) {
        return await
            Collaborator.update({
                collaborator_name: admin_name,
                login: login,
            }, {
                where: {
                    [Op.and]: [{
                        id: id,
                        admin: true
                    }]
                }
            });
    }

    async adminUpdatePassword(hash, id) {
        return await
            Collaborator.update({
                password: hash
            }, {
                where: {
                    [Op.and]: [{
                        id: id,
                        admin: true
                    }]
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

    async deleteAdmin(id) {
        return await
            Collaborator.destroy({
                where: {
                    [Op.and]: [{
                        id: id,
                        admin: true,
                        status: true
                    }]
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