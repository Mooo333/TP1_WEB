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

        if(req.query._body == "false")
        {
                    res.status(201).json();
        }         
        else
        {
            res.status(201).json(savedSuccursale);
            
        }

    }
    catch (err) {
        next(new createError.InternalServerError(err.message));
    }
});
router.put("/:uuidSuccursale", async(req, res, next) => {
    // route VL
    let SuccursaleTrouvee = await Succursale.findOne({_id: req.params.uuidSuccursale}); 
    
    try {
        let SuccursaleBefore = await SuccursaleTrouvee;
        console.log(SuccursaleBefore);
        if(SuccursaleBefore)
        {
            const UpdSuccursale = new Succursale(req.body);
            if (!UpdSuccursale.appelatif || !UpdSuccursale.addresse|| !UpdSuccursale.ville|| !UpdSuccursale.codePostal|| !UpdSuccursale.province|| !UpdSuccursale.telephone|| !UpdSuccursale.telecopieur|| !UpdSuccursale.information)
                res.status(417).json("manque un ou plusieurs arguments");
            else
                UpdSuccursale.save();
            
            if (Succursale.findOne({_id: UpdSuccursale.id}))
                await Succursale.deleteOne(SuccursaleTrouvee);
            else
                res.status(400).json("imposible de mettre la modification en BD"); //très rare voir impossible (prévention)


            if(req.query._body == "false")
            {
                        res.status(201).json("Sans infos");
            }         
            else
            {
                res.status(201).json(UpdSuccursale);
                
            }

        }
        else{
            res.status(404).json("la succursale du uuid n'à pas été trouvée");
            //throw new InternalServerError("Cannot find la Succursale");            
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