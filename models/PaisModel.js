const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database');

const Paises = db.define('paises', {
    idPais: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    nombrePais: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
}, {
    freezeTableName: true
});

module.exports = Paises;
