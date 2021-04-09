const AdminRepository = require('../repositories/AdminRepository');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

class AdminService {

    async adminIndexGet() {
        try {
            var admins = await AdminRepository.findAll();
            return admins;

        } catch (error) {
            return error;
        }

    }

    async adminCreatePost(login, password) {
        try {
            var collaborator = await AdminRepository.findCollaboratorByLogin(login);
            if (collaborator == null) {
                var admin = await AdminRepository.findOne(login);
                if (admin == undefined) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(password, salt);
                    await AdminRepository.createAdmin(login, hash);
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return -1;
            }

        } catch (error) {
            return error;
        }
    }

    async adminDeletePost(id) {
        try {
            var admins = await AdminRepository.findAll();
            if (Object.keys(admins).length > 1) {
                await AdminRepository.deleteAdmin(id);
            }
        } catch (error) {
            return error;
        }
    }

    async adminUpdateGet(id) {
        try {
            var admin = await AdminRepository.findByPk(id);
            return admin;

        } catch (error) {
            return error;
        }

    }

    async adminUpdatePost(id, login, password) {
        try {
            var collaborator = await AdminRepository.findCollaboratorByLogin(login);
            var login_name = await AdminRepository.findOne(login, id);

            if (collaborator == null && login_name == null) {
                var admin = await AdminRepository.findByPk(id);

                if (password == "") {
                    await AdminRepository.updateAdminLogin(login, id);
                    admin = {
                        id: id,
                        login: login
                    }
                    return 1;

                } else {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(password, salt);
                    await AdminRepository.adminUpdatePassword(hash, id);
                    await AdminRepository.updateAdminLogin(login, id);
                    admin = {
                        id: id,
                        login: login
                    }
                    return 1;
                }
            }
        } catch (error) {
            return error;
        }
    }
}

/* 
    async createAdminInitialProfile() {
        var admins = await AdminRepository.findAll();
        if (admins == null) {
 
            var login = 'admin';
            var password = 'admin';
 
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            await AdminRepository.createAdmin(login, hash);
        }
    } */


module.exports = new AdminService();