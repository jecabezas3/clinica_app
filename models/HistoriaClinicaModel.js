const { Sequelize, DataTypes } = require('sequelize');
const db = require('../config/database');
const Pacientes = require('./PacienteModel');

const Historias = db.define('historia', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    pacienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    fechaConsulta: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    codigoConsulta: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    motivoConsulta: {
        type: DataTypes.STRING,
        allowNull: true
    },
    diagnosticoPrincipal: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    diagnosticoSecundario: {
        type: DataTypes.STRING,
        allowNull: true
    },
    procedimiento: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    freezeTableName: true
});

// Relaciones
Pacientes.hasMany(Historias, { foreignKey: 'pacienteId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Historias.belongsTo(Pacientes, { foreignKey: 'pacienteId' });

module.exports = Historias;
