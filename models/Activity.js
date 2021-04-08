const Sequelize = require("sequelize");
const connection = require("../database/database");
const Process = require('./Process');
const Group = require('./Group');
const moment = require("moment");


const Activity = connection.define("activity", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    activity_name: {
        type: Sequelize.STRING,
        allowNull: false
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


Group.hasMany(Activity, {
    foreignKey: {
        name: 'group_id',
        allowNull: true
    }
});

Activity.belongsTo(Group, {
    foreignKey: {
        name: 'group_id',
        allowNull: true
    }
});

Process.hasMany(Activity, {
    foreignKey: {
        name: 'process_id',
        allowNull: false
    }
});

Activity.belongsTo(Process, {
    foreignKey: {
        name: 'process_id',
        allowNull: false
    }
});


Activity.sync({
    force: false
});
module.exports = Activity;

