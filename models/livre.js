const mongoose = require('mongoose');
const config = require('config');
const Schema = mongoose.Schema;
const Inventaire = mongoose.model('Inventaire');

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
    toJSON: {
        transform: function(doc, ret) {
            ret.href = `${config.api.baseUrl}/livres/${doc._id}`;
            if(!ret.inventaires){
                let inv = Inventaire.findOne({_id:"5d9f636d21c268248078f427"});
                ret.inventaires = inv;

                ret.inventaires = ret.inventaires.linkingBook(doc._id,false);
            }
            else {
                doc.inventaires.forEach((inv, i) => {
					ret.inventaires[i] = inv.linkingBook(doc._id, false);
				});
            }

            delete ret._id;
			ret.version = doc.__v;
            delete ret.__v;

            if(ret.commentaires){
                ret.commentaires.forEach(c => {
                    delete c._id;
                });
            }
            
            return ret;
        }
    },
    virtuals: true,
})

livreSchema.virtual('inventaires', {
	ref: 'Inventaire',
	localField: '_id',
	foreignField: 'livre',
	justOne: false
});

mongoose.model('Livre', livreSchema);