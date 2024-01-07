// database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ScarletElectronics', 'root', 'root', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

module.exports = sequelize;
