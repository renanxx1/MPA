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

    async findOne(login, id) {
        return await
            Admin.findOneByNameOrLoginNotSameId({
                where: {
                    [Op.and]: [{
                        login: login,
                        id: { [Op.not]: id },
                    }],
                }
            })
    }


    async findAdminByLogin(login) {
        return await
            Admin.findOne({
                where: {
                    login: login,
                }
            })
    }

    async findCollaboratorByLogin(login) {
        return await Collaborator.findOne({
            where: {
                [Op.and]: [{
                    login: login,
                }]
            }
        })
    }

    async createAdmin(admin_name, login, hash) {
        return await
            Admin.create({
                admin_name: admin_name,
                login: login,
                password: hash,
            })
    }

    async findOneByNameOrLoginNotSameId(login, id) {
        return await
            Collaborator.findOne({
                where: {
                    [Op.and]: [{
                        login: login,
                        id: { [Op.not]: id },
                    }]
                }
            })
    }

    async updateAdminLogin(admin_name, login, id) {
        return await
            Admin.update({
                admin_name: admin_name,
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

    async updateAdminLoginChangeToCollaborator(admin_name, login, id) {
        await
            Admin.update({
                admin_name: admin_name,
                login: login,
                status: false
            }, {
                where: {
                    id: id
                }
            });
        var admin = await Admin.findByPk(id);
        await Collaborator.update({
            collaborator_name: admin_name,
            login: login,
            status: true,
            where: {
                id: admin.collaborator_id
            }
        })
    }

    async adminUpdatePasswordChangeToAdmin(hash, id) {
        await
            Admin.update({
                password: hash,
                status: false
            }, {
                where: {
                    id: id
                }
            });
        var admin = await Admin.findByPk(id);
        await Collaborator.update({
            collaborator_name: admin_name,
            login: login,
            status: true,
            where: {
                id: admin.collaborator_id
            }
        })
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