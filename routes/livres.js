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
    const dateNow = moment();
    const newLivre = new Livre(req.body);
    const basicComment = {
        dateCommentaire: dateNow
    };

    if(newLivre){
        if(newLivre.commentaires.length == 0) 
            newLivre.commentaires.push(basicComment);
        else
            for(i = 0; i < newLivre.commentaires.length;i++){
                newLivre.commentaires[i].dateCommentaire = dateNow;
            }

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

        if (req.query.limit && req.query.offset) {
            limit = parseInt(req.query.limit, 10);
            offset = parseInt(req.query.offset, 10);
    
            if (isNaN(limit) || isNaN(offset)) {
                next(new createError.BadRequest('Invalid format for limit or offset'));
            }
        }

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
        next(new createError.InternalServerError(err.message)); 
    }
});

router.post("/:uuidLivre", async (req, res, next) => {
    // route VL
    //_body : Permets de retourner ou non la représentation de l’objet ajouté dans la réponse
    //Corps de requête | La représentation JSON de la succursale à ajouter
    //Type de réponse  | Objet ou Aucun contenu
    //• Code http de création avec succès
    //• La représentation JSON de la succursale ajoutée
    //• HEADER location contentant l’URL de la succursale ajoutée
    try { }
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

router.get("/:uuidLivre/inventaire", async (req, res, next) => {
    // route VL
    try { }
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

// ******************************* Routes de Maude *******************************
// URL:        /categories
// Réponse:    Collection sans meta-data
router.get("/categories", async (req, res, next) => {
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
    
    try {
        // Mise à jour partielle d'un livre
        let livreRequete = Livre.findOne({_id: req.params.uuidLivre});    // Trouver le bon livre à corriger
    
        try {
            let livreCherche = await livreRequete;

            if(livreCherche)
            {
                const patchLivre = req.body;                                            // Mettre le contenu du body dans une constante
                // Trouve les documents reliés à l'ID (uuidLivre) donné,
                // puis change les attributs envoyés dans la requête
                let savedLivre = await Livre.updateMany({_id:req.params.uuidLivre}, {$set: patchLivre});

                // Retrouver le document modifié 
                livreCherche = await Livre.findOne({_id: req.params.uuidLivre});

                if(req.query._body=="false")
                    res.status(200).json();            // Ne pas renvoyer d'objet
                else
                    res.status(200).json(livreCherche);// Renvoyer en réponse l'objet modifié
            }
            else{
                next(new createError.NotFound("Le livre correspondant à l'ID :" + req.params.uuidLivre + " est introuvable"))
            }
        } catch (err) {
            next(new createError.NotFound("Le livre correspondant à l'ID :" + req.params.uuidLivre + " est introuvable"))
        }

    } catch (err) {

        next(new createError.BadRequest(err));
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