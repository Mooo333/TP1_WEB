const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const createError = require('http-errors');

const router = express.Router();
const Livre = mongoose.model('Livre');
//const Inventaire = mongoose.model('Inventaire');

router.post("/livres/{uuidLivre}", async(req, res, next) => {

});

router.get("/{uuidLivre}/inventaire", async(req, res, next) => {
    
});

// ******************************* Routes de Maude *******************************
// URL:        /categories
// Réponse:    Collection sans meta-data
router.get("/categories", async(req, res, next) => {
    // Sélection de toutes les catégories

    res.status(200);
    res.end('La route categories');
});
// URL:        /livres/{uuidLivre}
// Parametres: expand (collection d'inventaire) & fields (select. attrib. spécif.)
// Réponse:    Objet
router.get("/:uuidLivre", async(req, res, next) => {
    // Sélection d'un livre
    try {
        // Trouver le livre à l'aide du _id
        let livreCherche = await Livre.findOne({_id: req.params.uuidLivre});
    
        console.log(livreCherche);
        if(req.query.expand === 'inventaires') {
            livreCherche.populate('inventaires');
        }

        if (livreCherche.length === 0) {
            next(new createError.NotFound());
        }

        res.status(200).json(livreCherche);

    } catch (err) {

        next(new createError.InternalServerError(err.message));
    }

});
// URL:        /livres/{uuidLivre}
// Parametres: _body permet de retourner la représ. de l'objet dans la réponse
// Réponse:    Objet
router.patch("/livres/{uuidLivre}", async(req, res, next) => {
    // Mise à jour partielle d'un livre
});
// URL:        /livres/{uuidLivre}/commentaires
// Parametres: _body permet de retourner la représ. de l'objet dans la réponse
// Réponse:    Objet
// Ajouter un header
router.post("/livres/{uuidLivre}/commentaires", async(req, res, next) => {
    // Ajouter un commentaire à propos d'un livre

});


// *****************************************************************************************

router.delete('/', (req, res, next) => {
    next(new createError.MethodNotAllowed());
});

router.put('/', (req, res, next) => {
    next(new createError.MethodNotAllowed());
});

module.exports = router;