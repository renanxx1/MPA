const Sequelize = require("sequelize");
const connection = require("../database/database");
const Process = require('./Process');
const Collaborator = require('./Collaborator');
const moment = require("moment");

const Collaborator_History = connection.define("collaborator_history", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    modelId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    archivedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    collaborator_name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    login: {
        type: Sequelize.STRING,
        allowNull: false
    },

    password: {
        type: Sequelize.STRING,
        allowNull: false
    },

    work_time: {
        type: Sequelize.FLOAT,
        allowNull: false
    },

    session_id: {
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
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
});

Collaborator_History.belongsTo(Process, {
    foreignKey: {
        name: 'process_id',
        allowNull: false
    }
});


Collaborator_History.sync({
    force: false
});

module.exports = Collaborator_History;