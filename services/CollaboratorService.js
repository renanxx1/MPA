const CollaboratorRepository = require('../repositories/CollaboratorRepository')
const bcrypt = require('bcryptjs');

class CollaboratorService {

    //Retorna dados para a pagina principal do colaborador
    async getIndex() {
        try {
            var collaborators = await CollaboratorRepository.findAll();
            return collaborators;

        } catch (error) {
            return error;
        }
    }

    //Retorna dados para a pagina de criar colaborador
    async getCreate() {
        try {
            var processes = await CollaboratorRepository.findAllProcesses();
            return processes;

        } catch (error) {
            return error;
        }
    }

    //Cria um colaborador
    async setCreate(collaborator_name, login, password, process, work_time) {
        try {
            var admin = await CollaboratorRepository.findAdminByLogin(login);
            if (admin == null) {
                var collaborator = await CollaboratorRepository.findOneByLoginOrName(collaborator_name, login);
                if (collaborator == undefined) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(password, salt);
                    await CollaboratorRepository.createCollaborator(collaborator_name, login, hash, process, work_time);
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

    //Deleta um colaborador
    async setDelete(id) {
        try {
            var chronometerHasCollaborator = await CollaboratorRepository.findChronometer(id);

            if (chronometerHasCollaborator == null) {
                await CollaboratorRepository.deleteCollaborator(id);
                return 1;
            } else {
                await CollaboratorRepository.updateCollaboratorStatus(id);
                return 1;
            }
        } catch (error) {
            return error;
        }
    }

    //Retorna dados para a pagina de atualizar colaborador
    async getUpdate(id) {
        try {
            var processes = await CollaboratorRepository.findAllProcesses();
            var collaborator = await CollaboratorRepository.findByPk(id);
            return { processes: processes, collaborator: collaborator };

        } catch (error) {
            return error;
        }
    }

    //Atualiza dados do colaborador
    async setUpdate(id, collaborator_name, login, password, process_id, work_time, admin_on) {
        try {
            var admin = await CollaboratorRepository.findAdminByLogin(login, id);
            var collaborator = await CollaboratorRepository.findOneByNameOrLoginNotSameId(login, id);
            var changeToAdmin = admin_on % 2;

            if (admin == null && collaborator == null) {

                if (changeToAdmin == 0) {
                    if (password != '****') {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(password, salt);

                        await CollaboratorRepository.updateCollaboratorWithPassword(id, collaborator_name, login, hash, process_id, work_time);
                        return 1;

                    } else {
                        await CollaboratorRepository.updateCollaboratorNoPassword(id, collaborator_name, login, process_id, work_time);
                        return 1;
                    }

                } else {
                    if (password != '****') {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(password, salt);

                        await CollaboratorRepository.updateCollaboratorWithPasswordChangeToAdmin(id, collaborator_name, login, hash, process_id, work_time);
                        return 2;

                    } else {
                        await CollaboratorRepository.updateCollaboratorNoPasswordChangeToAdmin(id, collaborator_name, login, process_id, work_time);
                        return 2;
                    }
                }

            } else {
                return -1;
            }

        } catch (error) {
            return error;
        }
    }


}


module.exports = new CollaboratorService();
