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
        await db.sync();
        await sessionStore.sync(); // Asegúrate de sincronizar el almacenamiento de sesiones
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Error synchronizing the models:", error);
    }
})();

app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Cookies seguras solo en producción
        httpOnly: true, // No accesible desde el frontend
        sameSite: 'None' // Necesario para cookies cross-site
    }
}));


app.use(cors({
    origin: 'https://madresegura.co',
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

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
