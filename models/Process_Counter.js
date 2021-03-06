const Sequelize = require("sequelize");
const connection = require("../database/database");
const Collaborator = require('./Collaborator');
const Process = require  ('./Process');
const moment = require("moment");

const Process_Counter = connection.define("processes_counter", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    counter: {
        type: Sequelize.FLOAT,
        allowNull: true,
    },
    process_counter: {
        type: Sequelize.STRING,
        allowNull: true
    },
    daily_goal: {
        type: Sequelize.FLOAT,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DATEONLY,
        get() {
            return moment(this.getDataValue('createdAt')).format('DD/MM/YYYY HH:mm:ss');
        }
    },
    updatedAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('updatedAt')).format('DD/MM/YYYY HH:mm:ss');
        }
    }
});

Process.hasOne(Process_Counter, {
    foreignKey:{
        name: 'process_id'
    }
})


Collaborator.hasOne(Process_Counter, {
    foreignKey: {
        name: 'collaborator_id',
        allowNull: false
    }
});


Process_Counter.sync({
    force: false
});
module.exports = Process_Counter;