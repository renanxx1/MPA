const DashboardRepository = require('../repositories/DashboardRepository');
class DashboardService {

    async dashboardGeneralIndexGet(req) {

    }


    async dashboardIndexGet(process, collaborator_id) {
        var collaborator = await DashboardRepository.findCollaborator(collaborator_id);
        var collaboratorProcessHistory = await DashboardRepository.findCollaboratorAndProcessHistory(process, collaborator_id);
        var process_name = await DashboardRepository.findProcessByName(process, collaborator_id);

        if (process_name != null && collaborator!=null) {
            return { collaborator: collaborator, collaboratorProcessHistory: collaboratorProcessHistory, process: process_name };
        } else {
            return null;
        }
    }


    async getDashboardData(collaborator_id, process_id, startDate, endDate) {
        var chronometers = await DashboardRepository.findAllActivitiesAndChronometers(collaborator_id, process_id, startDate, endDate);
        var process_counter = await DashboardRepository.findAllProcessAndCounter(collaborator_id, process_id, startDate, endDate);
        var idleTime = await DashboardRepository.findIdleTime(collaborator_id, process_id, startDate, endDate);

        if (chronometers[0] == null && process_counter[0] == null && idleTime[0] == null) {
            return null;
        } else {
            return { chronometers: chronometers, idleTime: idleTime, process_counter: process_counter };
        }
    }

}

module.exports = new DashboardService();