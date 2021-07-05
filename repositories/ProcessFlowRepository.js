const Collaborator = require('../models/Collaborator');
const Process = require('../models/Process');
class ProcessFlowRepository {

    async findAllCollaborators() {
        return await
            Collaborator.findAll({
                raw: true,
                nest: true,
                order: [
                    ['process_id', 'DESC']
                  ],
                include: [{
                    model: Process,
                }],
            })
    }

    async findAllProcesses() {
        return await
            Process.findAll({
                where: {
                    status: true
                }
            })
    }

}

module.exports = new ProcessFlowRepository();