const cors = require('cors');
const chalk = require('chalk');
const config = require('config');
const express = require('express');
const lib = require('./lib');

const app = express();

//lib.logger(app);

app.use(cors()); // Activation des cross-origin requests
app.use(express.json()); // Communication en JSON avec le client
//app.set('view engine','pug');

//Configuration de la base de données
require('./lib/database');

//Configuration des modèles de la base de données
require('./models');

const routes = require('./routes');

app.use('/livres', routes.livres);
app.use('/succursales', routes.succursales);
app.use('/inventaires', routes.inventaires);

lib.errors(app);

const PORT = config.api.port || 4500;
app.listen(PORT, () => console.log(chalk.rgb(127,255,0)('Mon serveur est en fonction')));