const { Op } = require("sequelize");
const Collaborator = require('../models/Collaborator');
const Process = require('../models/Process');

class LoginRepository {

    async findCollaborator(login) {
        return await
            Collaborator.findOne({
                include:[{
                    all:true
                }],
                where: {
                    login: login
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

}
module.exports = new LoginRepository();