const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');

const router = express.Router();
const Succursale = mongoose.model('Succursale');
const Inventaire = mongoose.model('Inventaire');

router.get('/:id', async (req, res, next) => {

    try { 
        let fields = {};
        let inventory = {};

        if (req.query.fields) {
            fields = req.query.fields.replace(/,/g, ' ');
        }

        let results = await Promise.all([
            Succursale.find({_id: req.params.id}, fields)
        ]);

        if (req.query.expand === "inventaires") {
            Inventaire.find({})
        }
        else {

        }

        res.status(200).json(results[0]);

    } catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

router.post("/", async(req, res, next) => {

});
router.post("/:uuidSucursale", async(req, res, next) => {
    
});


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