const DashboardRepository = require('../repositories/DashboardRepository');
class DashboardService {

    //Retorna dados para a pagina principal do sistema que lista todos colaboradores.
    async getIndex() {
        try {
            return await DashboardRepository.findAllCollaborators();
        } catch (error) {
            return error;
        }
    }

    //Retorna dados do cabeçalho para a pagina de dashboard colaborador
    async getIndexDashboard(process, collaborator_id) {
        try {

            var collaborator = await DashboardRepository.findCollaborator(collaborator_id);
            var collaboratorProcessHistory = await DashboardRepository.findCollaboratorAndProcessHistory(process, collaborator_id);
            var process_name = await DashboardRepository.findProcessByName(process, collaborator_id);
            if (process_name != null && collaborator != null) {
                return { collaborator: collaborator, collaboratorProcessHistory: collaboratorProcessHistory, process: process_name };
            } else {
                return null;
            }

        } catch (error) {
            return error
        }
    }

    //Retorna dados de grafico para a pagina de dashboard colaborador
    async getDashboardData(collaborator_id, process_id, startDate, endDate) {
        try {
            var chronometers = await DashboardRepository.findAllActivitiesAndChronometers(collaborator_id, process_id, startDate, endDate);
            var process_counter = await DashboardRepository.findAllProcessAndCounter(collaborator_id, process_id, startDate, endDate);
            var process_counter_total = await DashboardRepository.findAndSumProcessCounter(collaborator_id, process_id, startDate, endDate);
            var idleTime = await DashboardRepository.findIdleTime(collaborator_id, process_id, startDate, endDate);

            if (chronometers[0] == null && process_counter[0] == null && idleTime[0] == null) {
                return null;
            } else {
                return { chronometers: chronometers, idleTime: idleTime, process_counter: process_counter, process_counter_total: process_counter_total };
            }
        } catch (error) {
            return error;
        }
    }

}


module.exports = new DashboardService();