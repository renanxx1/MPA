const Process = require('../models/Process');
const ProcessFlowService = require('../services/ProcessFlowService');

class ProcessFlowController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }

}


async function renderIndex(req, res, code) {
    var get = await ProcessFlowService.getIndex();
    res.status(code).render('processflow/index', {
        collaborators: get.collaborators,
        processes: get.processes
    });
}


module.exports = new ProcessFlowController();