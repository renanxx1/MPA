const Admin = require('../models/Admin');
const Collaborator = require('../models/Collaborator');
const { Op } = require("sequelize");

class AdminRepository {

    async findAll() {
        return await
            Admin.findAll({
                include: [{
                    all: true
                }]
            });
    }

    async findOne(login) {
        return await
            Admin.findOne({
                where: {
                    login: login
                }
            })
    }

    async findCollaboratorByLogin(login) {
        return await Collaborator.findOne({
            where: {
                login: login
            }
        })
    }

    async createAdmin(login, hash) {
        return await
            Admin.create({
                login: login,
                password: hash,
            })
    }

    async findOneByNameOrLoginNotSameId(collaborator_name, login, id) {
        return await
            Admin.findOne({
                where: {
                    [Op.or]: [{
                        collaborator_name: collaborator_name
                    }, {
                        login: login
                    },
                    {
                        [Op.not]: [{
                            id: id
                        }]
                    }
                    ],
                }
            })
    }

    async updateAdminLogin(login, id) {
        return await
            Admin.update({
                login: login,
            }, {
                where: {
                    id: id
                }
            });
    }

    async adminUpdatePassword(hash, id) {
        return await
            Admin.update({
                password: hash
            }, {
                where: {
                    id: id
                }
            });
    }

    async deleteAdmin(id) {
        return await
            Admin.destroy({
                where: {
                    id: id
                }
            })
    }

    async findByPk(id) {
        return await
            Admin.findByPk(id);
    }

  

}

module.exports = new AdminRepository();