const Sequelize = require("sequelize");
const connection = require("../database/database");
const moment = require("moment");
const Collaborator = require("./Collaborator");
const Activity = require("./Activity");
const Process = require("./Process");

const Activity_Chronometer = connection.define("activities_chronometer", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },

    time: {
        type: Sequelize.TIME,
        allowNull: true
    },

    work_time: {
        type: Sequelize.FLOAT,
        allowNull: false
    },

    counter: {
        type: Sequelize.INTEGER,
        allowNull: false
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

Activity.hasOne(Activity_Chronometer, {
    foreignKey: {
        name: 'activity_id',
        allowNull: true,
    }
});

Collaborator.hasMany(Activity_Chronometer, {
    foreignKey: {
        name: 'collaborator_id',
        allowNull: false
    }
})

Process.hasMany(Activity_Chronometer,{
    foreignKey: {
        name: 'process_id',
        allowNull: false
    }
})

Activity_Chronometer.sync({
    force: false
});
module.exports = Activity_Chronometer;