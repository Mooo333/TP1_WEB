const mongoose = require('mongoose');
const config = require('config');
const Schema = mongoose.Schema;

const SuccursaleSchema = new Succursale({

    // ID généré aléatoirement
    appelatif: String,
    addresse: String,
    ville: String,
    codePostal: String,
    province: String,
    telephone: String,
    telecopieur: String,
    information: String,
})