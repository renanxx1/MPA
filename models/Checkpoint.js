const Sequelize = require("sequelize");
const connection = require("../database/database");
const moment = require("moment");
const Activity_Chronometer = require("./Activity_Chronometer");
const Collaborator = require("./Collaborator");
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
    },

    updatedAt: {
        type: Sequelize.DATE,
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

Checkpoint.sync({
    force: false
});

module.exports = Checkpoint;