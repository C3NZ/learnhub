const express = require('express');
const router = express.Router();

const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Get a specific user's profile
router.get('/:user', function(req, res, next) {
    User
        .findOne({ username: req.params.user })
        .then((user) => {
            if (user) {
                res.locals.profile = user;
                
                if (user.username === res.locals.user.username) {
                    res.locals.profilesMatch = true;
                }

                return res.render('profile', res.locals);
            }
        })
        .catch((err) => {
            if (process.env.DEBUG_MODE) {
                res.locals.error = err;
            }
            res.status(500).render('error', res.locals);
        });
});

module.exports = router;
