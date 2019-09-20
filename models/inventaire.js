const mongoose = require('mongoose');
const config = require('config');
const Schema = mongoose.Schema;

const inventaireSchema = new mongoose.Schema({
    quantite: Number,
    dateDerniereReception: Date,
    dateDerniereVente: Date,

    livre: {
        type: Schema.Types.ObjectId,
        ref: 'Livre'
    }
},{
    collection: 'inventaires',
    toJSON: {
        transform: function(doc, ret) {

            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

mongoose.model('Inventaire', inventaireSchema);