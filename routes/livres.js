const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const createError = require('http-errors');

const router = express.Router();
const Livre = mongoose.model('Livre');
const Succursale = mongoose.model('Succursale');

// *** Route a Francis *** //
// Corp de req : le livre
// To return : le livre ajouter (ou rien si po de livre add)
router.post("/", async(req, res, next) => {
    const dateNow = moment();
    const newLivre = new Livre(req.body);
    const basicComment = {
        dateCommentaire: dateNow,
        nom: "Anonyme",
        etoile: "5",
        message: "Quel bon livre"
    };

    if(newLivre){
        newLivre.commentaires.push(basicComment);

        if(!newLivre.titre) newLivre.titre = "Rumba";
        if(!newLivre.prix) newLivre.prix = "10";
        if(!newLivre.auteur) newLivre.auteur = "Robert";
        if(!newLivre.ISBN) newLivre.ISBN = "01010100101";
        if(!newLivre.categorie) newLivre.categorie = "Informatique";

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

router.delete("/:uuidLivre", async (req, res, next) => {
   let LivreASup = await Livre.findOne({_id: req.params.uuidLivre});
   
    try { 
        if(LivreASup)
        {
            Livre.deleteOne({_id: LivreASup.id});
            res.status(204).json("le livre est parti en fumé"); //
        }
        else
        {
            next(new createError.NotFound());
        }


    }
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

router.get("/:uuidLivre/inventaire", async (req, res, next) => {
    // route VL
    let livreTrouvee =  Livre.findOne({_id: req.params.uuidLivre});
    try { 

        if(livreTrouvee)
        {
            
            livreTrouvee.populate('inventaires');
           
        
            let livresRequete = await livreTrouvee;
            res.status(302).json(livresRequete.inventaires);

        }
        else
        {
            next(new createError.NotFound());
        }


    }
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

// ******************************* Routes de Maude *******************************
// URL:        /categories
// Réponse:    Collection sans meta-data
router.get("/categories", async (req, res, next) => {
    // Sélection de toutes les catégories
        let tousLivres = Livre.find({}, "categorie");    // Trouver tous les livres / tester s'il y en a 
    
        try {
            let toutesCategories = await tousLivres;

            if(toutesCategories)
            {
                
                res.status(200).json(toutesCategories);// Renvoyer en réponse l'objet modifié
            }
            else{
                next(new createError.BadRequest(err));
            }
        } catch (err) {
            next(new createError.BadRequest(err));
        }
    
});

// URL:        /succursales
router.get("/succursales", async (req, res, next) => {
    // Sélection de toutes les succursales
        let tousLivres = await Succursale.find({});    // Trouver tous les livres / tester s'il y en a 
    
        try {
           // let toutesSuccursales = await tousLivres;

            if(tousLivres)
            {
                res.status(200).json(tousLivres);// Renvoyer en réponse l'objet modifié
            }
            else{
                next(new createError.BadRequest(err));
            }
        } catch (err) {
            next(new createError.BadRequest(err));
        }
    
});

// URL:        /livres/{uuidLivre}
// Parametres: expand (collection d'inventaire) & fields (select. attrib. spécif.)
// Réponse:    Objet
router.get("/:uuidLivre", async(req, res, next) => {
    // Sélection d'un livre
    try {
        // Trouver le livre à l'aide du _id
        let livreCherche = Livre.find({_id: req.params.uuidLivre});
        if(req.query.expand === 'inventaires') {
            livreCherche.populate('inventaires');
           
        }
        let livresRequete = await livreCherche;

        if (livresRequete.length === 0) {
            next(new createError.NotFound());
        }
        res.status(200).json(livresRequete);
    } catch (err) {
        next(new createError.NotFound(err.message)); 
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
router.post("/:uuidLivre/commentaires", async(req, res, next) => {
    // Ajouter un commentaire à propos d'un livre
        let livreRequete = Livre.findOne({_id: req.params.uuidLivre});    // Trouver le bon livre pour ajouter le commentaire
        try {
            let livreCherche = await livreRequete;

            if(livreCherche)
            {
                const maintenant = moment();
                const com = {
                    dateCommentaire: maintenant,
                    message:req.body.message,
                    etoile:req.body.etoile
                }

                livreCherche.commentaires.push(com)
                livreCherche = await livreCherche.save();

                if(req.query._body=="false")
                    res.status(200).json();            // Ne pas renvoyer d'objet
                else
                    res.status(200).json(livreCherche);// Renvoyer en réponse l'objet modifié
            }
            else{
                next(new createError.NotFound());
            }
        } catch (err) {
            next(new createError.NotFound());
        }
});

// *****************************************************************************************

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