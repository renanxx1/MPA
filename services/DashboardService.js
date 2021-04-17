const DashboardRepository = require('../repositories/DashboardRepository');
class DashboardService {

    async dashboardGeneralIndexGet(req) {
  
    }


    async dashboardIndexGet(process, collaborator_id) {
        var collaborator = await DashboardRepository.findCollaboratorAndProcess(process, collaborator_id);
        return collaborator;
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