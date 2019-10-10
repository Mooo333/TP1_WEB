const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const moment = require('moment');

const router = express.Router();
const Inventaire = mongoose.model('Inventaire');

router.post('/', async (req, res, next) =>{
    const newLivre = new Inventaire(req.body);
    newLivre.dateDerniereReception = moment();
    newLivre.dateDerniereVente = moment();
    delete newLivre.__v; 

    if(newLivre){
        try {
            let saveLivre = await newLivre.save();
            res.status(201);

            saveLivre = saveLivre.toJSON();
            res.json(saveLivre);

        } catch (err) {
            next(new createError.InternalServerError(err.message));
        }
    }
    else
        next(new createError.BadRequest("Le livre voulant être enregistrer n'a pas pu l'être à cause que la requête n'est pas complète."));
})

router.get('/', async (req, res, next) =>{
    let obj = await Inventaire.find({});
    res.status(200).json(obj);
})

router.delete('/', (req, res, next) => {
    next(new createError.MethodNotAllowed());
}); 

router.patch('/', (req, res, next) => {
    next(new createError.MethodNotAllowed());
});

router.put('/', (req, res, next) => {
    next(new createError.MethodNotAllowed());
});

module.exports = router;