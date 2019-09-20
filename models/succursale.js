const mongoose = require('mongoose');
const config = require('config');
const Schema = mongoose.Schema;

const succursaleSchema = new Succursale({

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

succursaleSchema.virtual('inventaires', {
	ref: 'Package',
	localField: '_id',
	foreignField: 'shipment',
	justOne: false
});

mongoose.model('Succursale', succursaleSchema);