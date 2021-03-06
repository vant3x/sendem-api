const express = require('express');
const connectDB = require('./config/db');
const  cors = require('cors');

// crear el servidor
const app = express();

// conectar base datos
connectDB();

// habilitar cors
const corsOptions = {
    origin: process.env.FRONTEND_URL
}
app.use(cors(corsOptions));


app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", `${process.env.FRONTEND_URL}`);
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

// Puerto de la app
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());

// habilitar carpeta publica
app.use( express.static('uploads'));

// rutas de la app
app.use('/api', require('./src/routes/users.routes'));
app.use('/api', require('./src/routes/auth.routes'));
app.use('/api', require('./src/routes/links.routes'));
app.use('/api', require('./src/routes/files.routes'));
app.use('/api', require('./src/routes/folders.routes'));

// Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
})