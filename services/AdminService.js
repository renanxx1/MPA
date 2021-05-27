const AdminRepository = require('../repositories/AdminRepository');
const bcrypt = require('bcryptjs');

class AdminService {

    //Retorna dados para a pagina principal do admin
    async getIndex() {
        try {
            var admins = await AdminRepository.findAll();
            return admins;

        } catch (error) {
            return error;
        }

    }

    //Cria um admin
    async setCreate(adminData) {
        try {
            var collaborator = await AdminRepository.findCollaboratorByLogin(adminData.login);
            if (collaborator == null) {
                var admin = await AdminRepository.findAdminByLogin(adminData.login);
                if (admin == undefined) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(adminData.password, salt);
                    await AdminRepository.createAdmin(adminData.admin_name, adminData.login, hash);
                    return 1;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }

        } catch (error) {
            return error;
        }
    }

    //Deleta um admin
    async setDelete(id) {
        try {
            var admins = await AdminRepository.findAll();
            if (Object.keys(admins).length > 1) {
                await AdminRepository.deleteAdmin(id);
            }
        } catch (error) {
            return error;
        }
    }

    //Retorna dados para a pagina de atualizar admin
    async getUpdate(id) {
        try {
            var admin = await AdminRepository.findByPk(id);
            var processes = await AdminRepository.findAllProcesses();
            return { admin: admin, processes: processes }

        } catch (error) {
            return error;
        }
    }

    //Atualiza um admin
    async setUpdate(adminData) {

        try {
            var changeToCollaborator = adminData.admin_on % 2;
            if (changeToCollaborator == 1) {
                var checkCol = await AdminRepository.findOneCollaboratorLoginNotSameId(adminData.login, adminData.id);
                var checkAdm = await AdminRepository.findOneAdminLoginNotSameId(adminData.login, adminData.id);

                if (checkAdm == null && checkCol == null) {
                    if (adminData.password == "") {
                        var res = await AdminRepository.updateAdminLoginChangeToCollaborator(adminData.admin_name, adminData.login, adminData.id, adminData.process_id, adminData.work_time);
                        if (res == 0) {
                            return 0;
                        } else {
                            return 2;
                        }
                    } else {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(adminData.password, salt);
                        await AdminRepository.adminUpdatePasswordChangeToAdmin(adminData.admin_name, adminData.login, hash, adminData.id, adminData.process_id, adminData.work_time);
                        return 2;

                    }
                } else {
                    return 0;
                }

            } else {

                var collaborator = await AdminRepository.findCollaboratorByLogin(adminData.login);
                var admin = await AdminRepository.findOneAdminLoginNotSameId(adminData.login, adminData.id);

                if (collaborator == null && admin == null) {
                    if (adminData.password == "") {
                        await AdminRepository.updateAdminLogin(adminData.admin_name, adminData.login, adminData.id);
                        return 1;

                    } else {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(adminData.password, salt);
                        await AdminRepository.adminUpdatePassword(adminData.admin_name, adminData.login, hash, adminData.id);
                        return 1;
                    }
                } else {
                    return 0;
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