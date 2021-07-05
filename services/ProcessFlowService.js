const ProcessFlowRepository = require('../repositories/ProcessFlowRepository');

class ProcessFlowService {

    async getIndex() {
        var collaborators = await ProcessFlowRepository.findAllCollaborators();
        var processes = await ProcessFlowRepository.findAllProcesses();
        return { collaborators: collaborators, processes: processes };
    }



}

module.exports = new ProcessFlowService();