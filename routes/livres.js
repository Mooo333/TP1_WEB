const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const createError = require('http-errors');

const router = express.Router();
const Livre = mongoose.model('Livre');

// *** Route a Francis *** //
// Corp de req : le livre
// To return : le livre ajouter (ou rien si po de livre add)
router.post("/", async(req, res, next) => {

    const newLivre = new Livre(req.body);

    if(newLivre){
        try {
            let saveLivre = await newLivre.save();
            res.status(201);

            saveLivre = saveLivre.toJSON();
            res.header('Location', saveLivre.href);
            res.json(saveLivre);

        } catch (err) {
            next(new createError.InternalServerError(err.message));
        }
    }
    else
        next(new createError.BadRequest("Le livre voulant être enregistrer n'a pas pu l'être à cause que la requête n'est pas complète."));
});

// Corp de req : rien
// To return : tous les livres (si param cat, limiter la liste selon le critere)
router.get("/", async(req, res, next) => {
    try {
        let limit = 5;
        let offset = 0;

        let livreQuery;
        if(req.query.categorie) 
            livreQuery = Livre.find({categorie: req.query.categorie}).limit(limit).skip(offset);
        else
            livreQuery = Livre.find({}).limit(limit).skip(offset);

        livreQuery.populate('inventaires');
        livresCherche = await livreQuery;

        let responseBody = {};
        let totalBook = await Livre.countDocuments();

        responseBody.metadata = {};
        responseBody.metadata.resultset = {
            count: livresCherche.length,
            limit: limit,
            offset: offset,
            total: totalBook
        }

        responseBody.results = livresCherche;

        res.status(200).json(responseBody);

    } catch (err) {
        next(createError.InternalServerError("Oof"));
    }
});

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
router.patch("/:uuidLivre", async(req, res, next) => {
    // Mise à jour partielle d'un livre
    try {
        let livreCherche = await Livre.findOne({_id: req.params.uuidLivre}); // Trouver le bon livre à corriger
        const patchLivre = req.body;
        console.log(patchLivre);
        // livreCherche.update({_id:req.params.uuidLivre}, {$set: {categorie:patchLivre.categorie}})
        // livreCherche.update({}, {$set: {"categorie":patchLivre.categorie}}, false, true)
        // livreCherche.update({"_id":req.params.uuidLivre}, {$set: {"categorie":patchLivre.categorie}}, false, true)
        // livreCherche.update({"_id":req.params.uuidLivre}, {$set: {patchLivre}}, false, true)
        // livreCherche.update({}, {$set: {patchLivre}}, false, true)
        //let savedLivre = await Livre.findAndModify({_id:req.params.uuidLivre},  patchLivre);
        let savedLivre = livreCherche.updateOne({_id:req.params.uuidLivre}, {$set: patchLivre})
        
        // Une qui fonctionne
        // let savedLivre = await Livre.updateMany({_id:req.params.uuidLivre}, {$set: {categorie:patchLivre.categorie}})
        console.log("SaveLivre : ");
        console.log(savedLivre);
       // console.log(savedLivre.Livre);




        res.status(201).json(savedLivre);

    } catch (err) {
        next(new createError.BadRequest("N'a pas passé"))
    }


});
// URL:        /livres/{uuidLivre}/commentaires
// Parametres: _body permet de retourner la représ. de l'objet dans la réponse
// Réponse:    Objet
// Ajouter un header
router.post("/livres/:uuidLivre/commentaires", async(req, res, next) => {
    // Ajouter un commentaire à propos d'un livre

});


// *****************************************************************************************

router.delete('/', (req, res, next) => {
    next(new createError.MethodNotAllowed());
});

router.put('/', (req, res, next) => {
    next(new createError.MethodNotAllowed());
});

function errorMessage(res,devMsg,usrMsg,errorCode,info){
    res.status(errorCode);
    res.json({
        "developerMessage" : devMsg,
        "userMessage" : usrMsg,
        "errorCode" : errorCode,
        "moreInfo" : info
    });
}

module.exports = router;