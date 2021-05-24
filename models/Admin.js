const Sequelize = require("sequelize");
const connection = require("../database/database");
const moment = require("moment");

const Admin = connection.define("admins", {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
    },
    admin_name: {
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
    session_id: {
        type: Sequelize.STRING,
        allowNull: true
    },
    collaborator_id: {
        type: Sequelize.INTEGER,
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
    }
})

Admin.sync({
    force: false
});

module.exports = Admin;