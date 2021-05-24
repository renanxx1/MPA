const Admin = require('../models/Admin');
const { Op } = require("sequelize");
const Collaborator = require('../models/Collaborator');
const Process = require('../models/Process');

class LoginRepository {

    async findLoginAdmin(login) {
        return await
            Admin.findOne({
                attributes: ['id', 'login', 'password'],
                where: {
                    login: login
                }
            })
    }

    async findLoginCollaborator(login) {
        return await
            Collaborator.findOne({
                attributes: ['id', 'login', 'password', 'collaborator_name', 'process_id'],
                include: [{
                    attributes: ['process_name'],
                    model: Process,
                }],
                where: {
                    [Op.and]: [{
                        status: true,
                        login: login
                    }]
                }
            })
    }

    async findLogin(login, session_id) {
        return await
            Collaborator.findOne({
                raw: true,
                attributes: ['session_id'],
                where: {
                    [Op.and]: [{
                        session_id: session_id,
                        status: true,
                        login: login
                    }]
                }
            })
    }

    async updateCollaboratorSession(id, session_id) {
        return await
            Collaborator.update({
                session_id: session_id
            }, {
                where: {
                    id: id
                }
            });
    }

    async updateAdminSession(id, session_id) {
        return await
            Admin.update({
                session_id: session_id
            }, {
                where: {
                    id: id
                }
            });
    }
}
module.exports = new LoginRepository();