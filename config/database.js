const { Sequelize } = require("sequelize");

// const db = new Sequelize('madreseg_clinica_app', 'madreseg_clinica_app_user', 'holamundo123.', {
//   host: "190.90.160.166",
//   dialect: "mysql"
// });

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
