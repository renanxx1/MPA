const Process = require('../models/Process');
const ProcessFlowService = require('../services/ProcessFlowService');

class ProcessFlowController {

    async getIndex(req, res) {
        renderIndex(req, res, 200);
    }

}


async function renderIndex(req, res, code) {
    var processes = await ProcessFlowService.getIndex();
    res.status(code).render('processflow/index', {
        processes: processes
    });
}


module.exports = new ProcessFlowController();