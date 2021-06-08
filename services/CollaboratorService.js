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
    async setCreate(collaboratorData) {
        try {
            var admin = await CollaboratorRepository.findAdminByLogin(collaboratorData.login);
            if (admin == null) {
                var collaborator = await CollaboratorRepository.findOneByLoginOrName(collaboratorData.login);
                if (collaborator == undefined) {
                    var salt = bcrypt.genSaltSync(10);
                    var hash = bcrypt.hashSync(collaboratorData.password, salt);
                    await CollaboratorRepository.createCollaborator(collaboratorData.collaborator_name, collaboratorData.login, hash, collaboratorData.process_id, collaboratorData.work_time);
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
    async setUpdate(collaboratorData) {
      /*   try { */
            var admin = await CollaboratorRepository.findAdminByLogin(collaboratorData.id);
            var collaborator = await CollaboratorRepository.findOneByNameOrLoginNotSameId(collaboratorData.login, collaboratorData.id);
            var changeToAdmin = collaboratorData.admin_on % 2;

            if (admin == null && collaborator == null) {

                if (changeToAdmin == 0) {
                    if (collaboratorData.password != '') {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(collaboratorData.password, salt);

                        await CollaboratorRepository.updateCollaborator(collaboratorData.id, collaboratorData.collaborator_name, collaboratorData.login, hash, collaboratorData.process_id, collaboratorData.work_time);
                        await CollaboratorRepository.updateSessionCollaborator(collaboratorData.id);
                        return 1;

                    } else {
                        await CollaboratorRepository.updateSessionCollaborator(collaboratorData.id);
                        await CollaboratorRepository.updateCollaborator(collaboratorData.id, collaboratorData.collaborator_name, collaboratorData.login, null, collaboratorData.process_id, collaboratorData.work_time);
                        return 1;
                    }

                } else {
                    if (collaboratorData.password != '') {
                        var salt = bcrypt.genSaltSync(10);
                        var hash = bcrypt.hashSync(collaboratorData.password, salt);
                        await CollaboratorRepository.updateSessionCollaborator(collaboratorData.id);
                        await CollaboratorRepository.updateCollaboratorChangeToAdmin(collaboratorData.id, collaboratorData.collaborator_name, collaboratorData.login, hash, collaboratorData.process_id, collaboratorData.work_time);
                        return 2;

                    } else {
                        await CollaboratorRepository.updateSessionCollaborator(collaboratorData.id);
                        await CollaboratorRepository.updateCollaboratorChangeToAdmin(collaboratorData.id, collaboratorData.collaborator_name, collaboratorData.login, null, collaboratorData.process_id, collaboratorData.work_time);
                        return 2;
                    }
                }

            } else {
                return -1;
            }

      /*   } catch (error) {
            return error;
        } */
    }


}


module.exports = new CollaboratorService();
