const { Sequelize } = require("sequelize");

const db = new Sequelize('clinica_app', 'root', '', {
  host: "localhost",
  dialect: "mysql"
});

// Probar la conexión
db.authenticate()
  .then(() => {
    console.log('La conexión a la base de datos fue exitosa.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = db;
