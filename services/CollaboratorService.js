const CollaboratorRepository = require('../repositories/CollaboratorRepository')
const bcrypt = require('bcryptjs');

class CollaboratorService {

    async getIndex() {
        try {
            var collaborators = await CollaboratorRepository.findAll();
            return collaborators;

        } catch (error) {
            return error;
        }

    }

    async getCreate() {
        try {
            var processes = await CollaboratorRepository.findAllProcesses();
            return processes;

        } catch (error) {
            return error;
        }

    }

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

    async getUpdate(id) {
        try {
            var processes = await CollaboratorRepository.findAllProcesses();
            var collaborator = await CollaboratorRepository.findByPk(id);
            return { processes: processes, collaborator: collaborator };

        } catch (error) {
            return error;
        }

    }

    async setUpdate(id, collaborator_name, login, password, process_id, work_time) {
        try {
            var admin = await CollaboratorRepository.findAdminByLogin(login);
            if (admin == null) {
                var collaborator = await CollaboratorRepository.findOneByNameOrLoginNotSameId(collaborator_name, login, id);
                if (collaborator == null) {
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
                    return 0;
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
