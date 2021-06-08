const Admin = require('../models/Admin');
const Collaborator = require('../models/Collaborator');
const Process = require('../models/Process');
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

    async findAllProcesses() {
        return await
            Process.findAll({
                where:{
                    status:true
                }
            });
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
                    login: login,
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

    async findOneCollaboratorLoginNotSameId(login, id) {
        var collaborator = await Admin.findByPk(id);
        var result = await
            Collaborator.findOne({
                where: {
                    [Op.and]: [{
                        login: login,
                        id: { [Op.not]: collaborator.collaborator_id },
                        status: true,
                    }]
                }
            })
        return result;
    }

    async findOneAdminLoginNotSameId(login, id) {
        return await
            Admin.findOne({
                where: {
                    [Op.and]: [{
                        login: login,
                        id: { [Op.not]: id },
                    }]
                }
            })
    }

    async adminUpdate(admin_name, login, hash, id) {
        if(hash!=null){
            await
            Admin.update({
                admin_name: admin_name,
                login: login,
                password: hash
            }, {
                where: {
                    id: id
                }
            });
        }else{
            Admin.update({
                admin_name: admin_name,
                login: login,
            }, {
                where: {
                    id: id
                }
            });
        }
    }

    async adminUpdateChangeToAdmin(admin_name, login, hash, id, process_id, work_time) {
        var admin = await Admin.findByPk(id);
        if(hash!=null){
            if (admin.collaborator_id != null) {
                await
                    Admin.destroy({
                        where: {
                            id: id
                        }
                    });
                await Collaborator.update({
                    collaborator_name: admin_name,
                    login: login,
                    password: hash,
                    status: true,
                }, {
                    where: {
                        id: admin.collaborator_id
                    }
                })
                return 1;
    
            } else if (admin.collaborator_id == null) {
                await
                    Admin.destroy({
                        where: {
                            id: id
                        }
                    });
    
                await Collaborator.create({
                    collaborator_name: admin_name,
                    login: login,
                    password: hash,
                    process_id: process_id,
                    work_time: work_time,
                    status: true,
                })
    
                return 2;
            } else {
                return 0;
            }
        }else{
            if (admin.collaborator_id != null) {
                await
                    Admin.destroy({
                        where: {
                            id: id
                        }
                    });
                await Collaborator.update({
                    collaborator_name: admin_name,
                    login: login,
                    status: true,
                }, {
                    where: {
                        id: admin.collaborator_id
                    }
                })
                return 1;
    
            } else if (admin.collaborator_id == null) {
                await
                    Admin.destroy({
                        where: {
                            id: id
                        }
                    });
    
                await Collaborator.create({
                    collaborator_name: admin_name,
                    login: login,
                    password: admin.password,
                    process_id: process_id,
                    work_time: work_time,
                    status: true,
                })
    
                return 2;
            } else {
                return 0;
            }
        }
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