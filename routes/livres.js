const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Succursale = mongoose.model('Livre');

router.post("/livres/{uuidLivre}", async(req, res, next) => {

});

router.get("/{uuidLivre}/inventaire", async(req, res, next) => {
    
});

// ******* Routes de Maude *******
// URL:        /categories
// Réponse:    Collection sans meta-data
router.get("/categories", async(req, res, next) => {
    res.status(200);
    res.end('La route categories');
});
// URL:        /livres/{uuidLivre}
// Parametres: expand (collection d'inventaire) & fields (select. attrib. spécif.)
// Réponse:    Objet
router.get("/livres/{uuidLivre}", async(req, res, next) => {
    
});
// URL:        /livres/{uuidLivre}
// Parametres: _body permet de retourner la représ. de l'objet dans la réponse
// Réponse:    Objet
router.patch("/livres/{uuidLivre}", async(req, res, next) => {
    
});
// URL:        /livres/{uuidLivre}/commentaires
// Parametres: _body permet de retourner la représ. de l'objet dans la réponse
// Réponse:    Objet
// Ajouter un header
router.post("/livres/{uuidLivre}/commentaires", async(req, res, next) => {
    
});


// *******************************

router.delete('/', (req, res, next) => {
    next(new createError.MethodNotAllowed());
});

router.put('/', (req, res, next) => {
    next(new createError.MethodNotAllowed());
});

module.exports = router;