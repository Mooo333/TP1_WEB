const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Succursale = mongoose.model('Livre');

router.post("/livres/{uuidLivre}", async(req, res, next) => {

});

router.get("/{uuidLivre}/inventaire", async(req, res, next) => {
    
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