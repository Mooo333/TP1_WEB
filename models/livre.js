const mongoose = require('mongoose');
const config = require('config');
const Schema = mongoose.Schema;

const livreSchema = new Livre({

    // ID généré aléatoirement
    categorie: String,
    titre: String,
    prix: Number,
    auteur: String,
    sujet: String,
    ISBN: String,

    commentaires: [{
        dateCommentaire: Date,
        message: String,
        etoile: Number
	}]
})

livreSchema.virtual('inventaires', {
	ref: 'Inventaire',
	localField: '_id',
	foreignField: 'livre',
	justOne: false
});

mongoose.model('Livre', livreSchema);