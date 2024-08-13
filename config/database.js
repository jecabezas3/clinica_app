const { Sequelize } = require("sequelize");

const db = new Sequelize('freedb_clinica_app', 'freedb_clinica_app_user', '9$ZkyDn8X*u@Hb%.', {
  host: "sql.freedb.tech",
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
