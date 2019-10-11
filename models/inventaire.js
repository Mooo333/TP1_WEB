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
    },

    succursale: {
        type: Schema.Types.ObjectId,
        ref: 'Succursale'
    }
},{
    collection: 'Inventaires',
    //virtuals: true,
},{
    collection: 'livres',
    toJSON: {
        transform: function(doc, ret) {

            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },

    collection: 'succursales',
    toJSON: {
        transform: function(doc, ret) {

            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

inventaireSchema.methods.linkingBook = function(id, isShipmentObjectPresent = true) {
    
    const _id = this._id;
    const bookHref = `${config.api.baseUrl}/livres/${id}`;
    const linkedInv = this.toJSON();
    linkedInv.href = `${bookHref}/inventaires/${_id}`;
    if(isShipmentObjectPresent) {
        linkedInv.shipment = {}
        linkedInv.shipment.href = bookHref;
    } else {
        delete linkedInv.livre;
    }

    return linkedInv;
}

inventaireSchema.methods.linkingSuccursale = function(id, isShipmentObjectPresent = true) {
    
    const _id = this._id;
    const succursaleHref = `${config.api.baseUrl}/succursales/${id}`;
    const linkedInv = this.toJSON();
    linkedInv.href = `${succursaleHref}/inventaires/${_id}`;
    if(isShipmentObjectPresent) {
        linkedInv.shipment = {}
        linkedInv.shipment.href = succursaleHref;
    } else {
        delete linkedInv.livre;
    }

    return linkedInv;
}

mongoose.model('Inventaire', inventaireSchema);