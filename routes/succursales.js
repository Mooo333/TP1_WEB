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

        let query = Succursale.find({_id: req.params.id}, fields);

        if(req.query.expand === 'inventaires')
            query.populate('inventaires');

        let results = await query;

        res.status(200).json(results);

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