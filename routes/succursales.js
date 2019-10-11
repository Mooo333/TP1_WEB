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

        if(!results) next(new createError.NotAcceptable(err.message));

        res.status(200).json(results);

    } catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});

router.post("/", async(req, res, next) => {
    // route VL
    const neoSuccursale = new Succursale(req.body);
    try { 


        const savedSuccursale = await neoSuccursale.save();
        res.status(201);
        res.json(savedSuccursale);

    }
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});
router.put("/:uuidSucursale", async(req, res, next) => {
    // route VL
    const SuccursaleTrouvee = await Succursale.findOne({_id: req.params.uuidSuccursale}); 
    
    try {
        if(SuccursaleTrouvee)
        {
            const UpdSuccursale = new Succursale(req.body);
            Succursale.deleteOne(SuccursaleTrouvee);
            UpdSuccursale.save();



        }
        else{
            throw new console.error(message, "cannot find Succursale");
            
        }

    }
    
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



module.exports = router;