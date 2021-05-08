const ProcessRepository = require('../repositories/ProcessRepository');


class ProcessService {

    //Retorna dados para a pagina principal
    async getIndex() {
        var processes = await ProcessRepository.findAll();
        return processes;
    }

    //Retorna dados para a pagina de criar processo
    async setCreate(process_name, process_counter, process_counterCheck, process_goal, process_goalCheck) {
        var process = await ProcessRepository.findOneByName(process_name);
        if (process == undefined) {
            if (process_counterCheck) {
                await ProcessRepository.createProcessAndCounterAndGoal(process_name, process_counter, process_goal);
                return 1;
            } else {
                await ProcessRepository.createProcessAndCounterAndGoal(process_name, null);
                return 1;
            }
        } else {
            return 0;
        }
    }

    //Deleta um processo
    async setDelete(id) {
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

    //Retorna dados para a pagina de atualizar processos
    async getUpdate(id) {
        var process = await ProcessRepository.findByPk(id);
        return process;
    }

    //Atualiza dados do processo
    async setUpdate(id, process_name, process_counter, process_counterCheck, process_goal, process_goalCheck) {
        var process = await ProcessRepository.findOneByNameNotSameId(id, process_name);

        if (process == null) {
            if (process_counterCheck) {
                await ProcessRepository.updateProcessAndCounterAndGoal(id, process_name, process_counter, process_goal);
                return 1;

            } else {
                await ProcessRepository.updateProcessAndCounterAndGoal(id, process_name, null, null);
                return 1;
            }

        } else {
            return 0;
        }
    }

}


module.exports = new ProcessService();