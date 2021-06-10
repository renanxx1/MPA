const ProcessFlowRepository = require('../repositories/ProcessFlowRepository');

class ProcessFlowService {

    async getIndex() {
        var processes = await ProcessFlowRepository.findAllProcesses();
        return processes;
    }



}

module.exports = new ProcessFlowService();