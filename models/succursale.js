const mongoose = require('mongoose');
const config = require('config');
const Schema = mongoose.Schema;

const succursaleSchema = new Schema({

    // ID généré aléatoirement
    appelatif: String,
    addresse: String,
    ville: String,
    codePostal: String,
    province: String,
    telephone: String,
    telecopieur: String,
    information: String,
},{
    collection: 'Succursales', 
    toJSON: {
        transform: function(doc, ret) {
        ret.href = `${config.api.baseUrl}/succursales/${doc._id}`;
        ret.inventaires = doc.inventaires;
        if(ret.inventaires){
            if(ret.inventaires.length == 0){
                ret.inventaires = {};
                ret.inventaires.href = `${ret.href}/inventaires`;
            }
            else{
                doc.inventaires.forEach((inv, i) => {
                    ret.inventaires[i] = inv.linkingSuccursale(doc._id,false);
                });
            }

            delete ret._id;
            ret.version = doc.__v;
            delete ret.__v;
            }
        
        return ret;
        }
    },
    virtuals: true,
})

succursaleSchema.virtual('inventaires', {
	ref: 'Inventaire',
	localField: '_id',
	foreignField: 'succursale',
	justOne: false
});

mongoose.model('Succursale', succursaleSchema);