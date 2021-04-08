const ProcessRepository = require('../repositories/ProcessRepository');


class ProcessService {

    async processIndexGet() {
        var processes = await ProcessRepository.findAll();
        return processes;
    }

    async processCreatePost(process_name, process_counter, main_functionCheck) {
        var process = await ProcessRepository.findOneByName(process_name);
        if (process == undefined) {
            if (main_functionCheck) {
                await ProcessRepository.createProcessAndFunction(process_name, process_counter);
                return 1;
            } else {
                await ProcessRepository.createProcessAndFunction(process_name, '');
                return 1;
            }
        } else {
            return 0;
        }
    }

    async processDeletePost(id) {
        var processHasActivity = await ProcessRepository.findActivitiesInProcess(id);
        var processHasCollaborator = await ProcessRepository.findCollaboratorsInProcess(id);
        var processHasActivityStatusFalse = await ProcessRepository.findActivitiesInProcessStatusFalse(id);


        if (Object.keys(processHasActivity).length == 0 && processHasCollaborator == null && processHasActivityStatusFalse != null) {
            await ProcessRepository.updateProcessStatus(id);
            return 1;

        } else if (Object.keys(processHasActivity).length == 0 && processHasCollaborator == null) {
            await ProcessRepository.deleteProcess(id);
            return 1;

        } else {
            return 0;
        }
    }

    async processUpdateGet(id) {
        var process = await ProcessRepository.findByPk(id);
        return process;
    }

    async processUpdatePost(id, process_name, process_counter, main_functionCheck) {
        var process = await ProcessRepository.findOneByNameNotSameId(id, process_name);
        if (process == null) {
            if (main_functionCheck) {
                await ProcessRepository.updateProcessAndFunction(id, process_name, process_counter);
                return 1;

            } else {
                await ProcessRepository.updateProcessAndFunction(id, process_name, '');
                return 1;
            }

        } else {
            return 0;
        }
    }

}

module.exports = new ProcessService();