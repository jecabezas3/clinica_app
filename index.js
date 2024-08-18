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
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Asegúrate de que sea true en producción
        httpOnly: false, 
        sameSite: 'lax', 
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

app.use(cors({
    origin: 'https://frontendclinica.madresegura.co',
    credentials: true 
}));

app.use(express.json());

// Usar las rutas
app.use('/api/users', require("./routes/UserRoute.js"));
app.use('/api/pacientes', require("./routes/PacienteRoute.js"));
app.use('/api/auth', require("./routes/AuthRoute.js"));
app.use('/api/historias', require("./routes/HistoriaClinicaRoute.js"));
app.use('/api/paises', require("./routes/PaisRoute.js"));

// Manejo de errores
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

// Inicio del servidor
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
