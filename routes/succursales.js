const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Succursale = mongoose.model('Succursale');

router.get('/:uuidSuccursale', async (req, res, next) => {

    //Gestion du batching/paging
    if (req.query.limit && req.query.offset) {
        limit = parseInt(req.query.limit, 10);
        offset = parseInt(req.query.offset, 10);

        if (isNaN(limit) || isNaN(offset)) {
            next(new createError.BadRequest('Invalid format for limit or offset'));
        }
    }

    try { 
        let fields = {};
        if (req.query.fields) {
            fields = req.query.fields.replace(/,/g, ' ');
        }

        if (req.query.expand) {

        }

        let results = await Promise.all([
            Succursale.find({}, fields)
               /* .sort({ 'shipDate': -1 }).limit(limit).skip(offset),
            Succursale.countDocuments()*/
        ]);

        let responseBody = {};

        responseBody.metadata = {};
        responseBody.metadata.resultset = {
            count: results[0].length,
            total: results[1]
        };

        responseBody.results = results[0];

        res.status(200).json(responseBody);

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