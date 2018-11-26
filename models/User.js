const sequelize = require('../db/connect');
const Sequelize = require('sequelize');
const User = sequelize.define('t_user', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    avatar: {
        type: Sequelize.STRING
    },
    identity: {
        type: Sequelize.STRING
    }
});
module.exports = User;