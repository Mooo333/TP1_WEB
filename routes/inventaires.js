const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const moment = require('moment');

const router = express.Router();
const Inventaire = mongoose.model('Inventaire');

router.post('/', async (req, res, next) =>{
})

router.get('/', async (req, res, next) =>{
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