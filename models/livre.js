const mongoose = require('mongoose');
const config = require('config');
const Schema = mongoose.Schema;

const livreSchema = new Schema({

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
},{
    collection: 'Livres',
    virtuals: true,
})

livreSchema.virtual('inventaires', {
	ref: 'Inventaire',
	localField: '_id',
	foreignField: 'livre',
	justOne: false
});

livreSchema.methods.link = function() {
    
    const _id = this._id;
    const bookHref = `${config.api.baseUrl}/livres/${_id}`;

    return bookHref;
}

mongoose.model('Livre', livreSchema);