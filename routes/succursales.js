const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');

const router = express.Router();
const Succursale = mongoose.model('Succursale');

router.get('/:id', async (req, res, next) => {

    try { 
        let fields = {};

        if (req.query.fields) {
            fields = req.query.fields.replace(/,/g, ' ');
        }
        
        let query = Succursale.findOne({_id: req.params.id}, fields);

        if(req.query.expand === 'inventaires') query.populate('inventaires');
        else query.populate('inventaires','href');

        let results = await query;

        res.status(200).json(results);

    } catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

router.post("/", async(req, res, next) => {
    // route VL
    try { }
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});
router.post("/:uuidSucursale", async(req, res, next) => {
    // route VL
    try { }
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
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