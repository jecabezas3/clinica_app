const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
const db = require("./config/database.js");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Importar rutas
const UserRoute = require("./routes/UserRoute.js");

const PacienteRoute = require("./routes/PacienteRoute.js");
const AuthRoute = require("./routes/AuthRoute.js");
const HistoriaClinicaRoute = require("./routes/HistoriaClinicaRoute.js");
const PaisRoute = require("./routes/PaisRoute.js");

dotenv.config();

const app = express();

(async () => {
    try {
        await db.sync();
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Error synchronizing the models:", error);
    }
})();


// Configuración de la base de datos
const sessionStore = new SequelizeStore({
    db: db
});

app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    origin: 'https://madresegura.co',
    credentials: true 
}));

app.use(express.json());

// Usar las rutas
app.use(UserRoute);
// Agregar otras rutas aquí
app.use(PacienteRoute);
app.use(AuthRoute);
app.use(HistoriaClinicaRoute);
app.use(PaisRoute);
store.sync();

// Manejo de errores
app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
