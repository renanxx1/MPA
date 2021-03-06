const Sequelize = require("sequelize");
const connection = require("../database/database");
const moment = require("moment");
const Activity_Chronometer = require("./Activity_Chronometer");
const Collaborator = require("./Collaborator");
const Process= require("./Process");
const {
    checkPoint
} = require("../services/CollectorService");

const Checkpoint = connection.define("checkpoint", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },

    createdAt: {
        type: Sequelize.DATEONLY,
        get() {
            return moment(this.getDataValue('createdAt')).format('DD/MM/YYYY');
        }
    },

    updatedAt: {
        type: Sequelize.DATE,
        get() {
            return moment(this.getDataValue('updatedAt')).format('DD/MM/YYYY HH:mm:ss');
        }
    }
});

Activity_Chronometer.hasOne(Checkpoint, {
    foreignKey: {
        name: 'chronometer_id',
        allowNull: false,
    }
});

Collaborator.hasOne(Checkpoint, {
    foreignKey: {
        name: 'collaborator_id',
        allowNull: false,
    }
})

Process.hasOne(Checkpoint, {
    foreignKey: {
        name: 'process_id',
        allowNull: false,
    }
})

Checkpoint.sync({
    force: false
});

module.exports = Checkpoint;