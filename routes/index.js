const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', res.locals);
});

/* GET popular page. */
router.get('/popular', (req, res, next) => {
    res.render('popular', res.locals);
});

/* GET subjects page. */
router.get('/subjects', (req, res, next) => {
    res.render('subjects', res.locals);
});

/* GET math page page. */
router.get('/subjects/:subjectName', (req, res, next) => {
    res.locals.subjectName = req.params.subjectName; 
    res.render('subject', res.locals);
});

module.exports = router;
