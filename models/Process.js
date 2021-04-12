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
    },
    updatedAt: {
        type: Sequelize.DATE,
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



