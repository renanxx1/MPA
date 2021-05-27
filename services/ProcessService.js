const ProcessRepository = require('../repositories/ProcessRepository');


class ProcessService {

    //Retorna dados para a pagina principal
    async getIndex() {
        try {
            var processes = await ProcessRepository.findAll();
            return processes;

        } catch (error) {
            return error;
        }
    }

    //Retorna dados para a pagina de criar processo
    async setCreate(processData) {
        try {
            var process = await ProcessRepository.findOneByName(processData.process_name);
            if (process == undefined) {
                if (processData.process_counterCheck) {
                    await ProcessRepository.createProcessAndCounterAndGoal(processData.process_name, processData.process_counter, processData.process_goal);
                    return 1;
                } else {
                    await ProcessRepository.createProcessAndCounterAndGoal(processData.process_name, null);
                    return 1;
                }
            } else {
                return 0;
            }
        } catch (error) {
            return error;
        }
    }

    //Deleta um processo
    async setDelete(id) {
        try {
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

        } catch (error) {
            return error;
        }
    }

    //Retorna dados para a pagina de atualizar processos
    async getUpdate(id) {
        try {
            var process = await ProcessRepository.findByPk(id);
            return process;

        } catch (error) {
            return error;
        }
    }

    //Atualiza dados do processo
    async setUpdate(processData) {

        try {
            var process = await ProcessRepository.findOneByNameNotSameId(processData.id, processData.process_name);

            if (process == null) {
                if (processData.process_counterCheck) {
                    await ProcessRepository.updateProcessAndCounterAndGoal(processData.id, processData.process_name, processData.process_counter, processData.process_goal);
                    return 1;

                } else {
                    await ProcessRepository.updateProcessAndCounterAndGoal(processData.id, processData.process_name, null, null);
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


module.exports = new ProcessService();