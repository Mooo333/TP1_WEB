const config = require('config');
const mongoose = require('mongoose');
let gracefulShutdown;
const dbURI = process.env.MONGO_URL || config.dbConfig.url;

