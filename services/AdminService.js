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
    async setCreate(admin_name, login, password) {
        try {
            var collaborator = await AdminRepository.findCollaboratorByLogin(login);
            if (collaborator == null) {
                var admin = await AdminRepository.findAdminByLogin(login);
                if (admin == undefined) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(password, salt);
                    await AdminRepository.createAdmin(admin_name, login, hash);
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
    async setUpdate(id, admin_name, login, password, admin_on, process_id, work_time) {
      
        try {
            var changeToCollaborator = admin_on % 2;
            if (changeToCollaborator == 1) {
                var checkCol = await AdminRepository.findOneCollaboratorLoginNotSameId(login, id);
                var checkAdm = await AdminRepository.findOneAdminLoginNotSameId(login, id);

                if (checkAdm == null && checkCol == null) {
                    if (password == "") {
                        var res = await AdminRepository.updateAdminLoginChangeToCollaborator(admin_name, login, id, process_id, work_time);
                        if(res==0){
                            return 0;
                        }else{
                            return 2;
                        }
                    } else { //CORRIGIR ABAIXO
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(password, salt);
                        await AdminRepository.adminUpdatePasswordChangeToAdmin(hash, id);
                        return 2;

                    }
                } else {
                    return 0;
                }

            } /* else {

                var collaborator = await AdminRepository.findCollaboratorByLogin(login);
                var admin = await AdminRepository.findOneAdminLoginNotSameId(login, id);

                if (collaborator == null && admin == null) {
                    if (password == "") {
                        await AdminRepository.updateAdminLogin(admin_name, login, id);
                        return 1;

                    } else {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(password, salt);
                        await AdminRepository.adminUpdatePassword(hash, id);
                        return 1;
                    }
                } else {
                    return 0;
                } */

        /*     } */

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