const Sequelize = require("sequelize");
const sequelizeHistory = require('sequelize-history');
const connection = require("../database/database");
const Process = require('./Process');
const moment = require("moment");

const Collaborator = connection.define("collaborator", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
        allowNull: true
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

    admin:{
        type: Sequelize.BOOLEAN,
        allowNull: false
    },

    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
});

Collaborator.belongsTo(Process, {
    foreignKey: {
        name: 'process_id',
        allowNull: true
    }
});

sequelizeHistory(Collaborator, connection);


Collaborator.sync({
    force: false
});

module.exports = Collaborator;