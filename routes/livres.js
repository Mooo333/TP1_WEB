const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Succursale = mongoose.model('livre');

router.post("/livres/{uuidLivre}", async(req, res, next) => {

});

router.get("/{uuidLivre}/inventaire", async(req, res, next) => {
    
});