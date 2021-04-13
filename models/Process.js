const Sequelize = require("sequelize");
const connection = require("../database/database");
const moment = require("moment");

const Process = connection.define("process", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    process_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    process_counter: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('createdAt')).format('DD/MM/YYYY HH:mm:ss');
        }
    },
    updatedAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('updatedAt')).format('DD/MM/YYYY HH:mm:ss');
        }
    },
    daily_goal: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
})


Process.sync({
    force: false
});
module.exports = Process;


