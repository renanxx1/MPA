const Process = require('../models/Process');
const { Op } = require("sequelize");
class ProcessFlowRepository {

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