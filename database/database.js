const Sequelize = require('sequelize');

const connection = new Sequelize('MPA', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00"
});

module.exports = connection;