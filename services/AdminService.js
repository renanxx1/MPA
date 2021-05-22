const CollaboratorRepository = require('../repositories/CollaboratorRepository');
const bcrypt = require('bcryptjs');

class AdminService {

    //Retorna dados para a pagina principal do admin
    async getIndex() {
        try {
            var admins = await CollaboratorRepository.findAllAdmin();
            return admins;

        } catch (error) {
            return error;
        }

    }

    //Cria um admin
    async setCreate(admin_name, login, password) {
        try {
            var collaborator = await CollaboratorRepository.findOneByLoginOrName(login);
            if (collaborator == null) {

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
                await CollaboratorRepository.createAdmin(admin_name, login, hash);
                return 1;

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
            var admins = await CollaboratorRepository.findAllAdmin();
            if (Object.keys(admins).length > 1) {
                await CollaboratorRepository.deleteAdmin(id);
            }
        } catch (error) {
            return error;
        }
    }

    //Retorna dados para a pagina de atualizar admin
    async getUpdate(id) {
        try {
            var admin = await CollaboratorRepository.findByPk(id);
            return admin;

        } catch (error) {
            return error;
        }
    }

    //Atualiza um admin
    async setUpdate(id, admin_name, login, password) {
        try {
            var login_name = await CollaboratorRepository.findOneByNameOrLoginNotSameId(admin_name, login, id);
            if (login_name == null) {
                var admin = await CollaboratorRepository.findByPk(id);

                if (password == "") {
                    await CollaboratorRepository.updateAdminLogin(admin_name, login, id);
                    admin = {
                        id: id,
                        login: login
                    }
                    return 1;

                } else {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(password, salt);
                    await CollaboratorRepository.adminUpdatePassword(hash, id);
                    await CollaboratorRepository.updateAdminLogin(admin_name, login, id);
                    admin = {
                        id: id,
                        login: login
                    }
                    return 1;
                }
            } else {
                return 0;
            }
        } catch (error) {
            return error;
        }
    }
}


module.exports = new AdminService();