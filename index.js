const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const db = require("./config/database.js");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

dotenv.config();

const app = express();

// Configuración del almacenamiento de sesiones
const sessionStore = new SequelizeStore({
    db: db,
    tableName: 'sessions' // Configura el nombre de la tabla si lo deseas
});

(async () => {
    try {
        await db.sync(); // Sincroniza los modelos con la base de datos
        await sessionStore.sync(); // Sincroniza la tabla de sesiones
        console.log("All models and session store were synchronized successfully.");
    } catch (error) {
        console.error("Error synchronizing the models or session store:", error);
    }
})();

// Configuración del middleware
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false, // Solo guarda la sesión si ha habido cambios
    saveUninitialized: false, // No guarda sesiones no inicializadas
    store: sessionStore,
}));

app.use(cors({
    //origin: 'https://frontendclinica.madresegura.co',
    origin: 'http://localhost:3000',
    credentials: true 
}));

app.use(express.json());

// Usar las rutas
app.use(require("./routes/UserRoute.js"));
app.use(require("./routes/PacienteRoute.js"));
app.use(require("./routes/AuthRoute.js"));
app.use(require("./routes/HistoriaClinicaRoute.js"));
app.use(require("./routes/PaisRoute.js"));

// Manejo de errores
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// Inicio del servidor
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
