const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Get the sign up form for the user
router.get('/signup', (req, res) => {
    res.render('signup', res.locals);
});

// Get the login form for the user
router.get('/login', (req, res) => {
    res.render('login', res.locals)
});

// Create a new login
router.post('/', (req, res, next) => {
    User
        .create(req.body)
        .then((user) => {
            const tokenPayload = {
                username: user.username,
                id: user._id,
            }

            const tokenHeaders = { expiresIn: '60 days' };
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, tokenHeaders);

            // Create a cooke with the encrypted jwt token, then send it to the user
            res.cookie('lhAuth', token, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.render('profile', res.locals);
        })
        .catch((err) => {
            return next(err);
        })
});

// Sign the user in
router.put('/', (req, res) => {
    const { username, password } = req.body;

    User
        .findOne({ username }, 'username password')
        .then((user) => {

            // Render the login page with an error
            if (!user) {
                return res.status(403).render('login', res.locals);
            }

            user.comparePassword(password, (err, isMatch) => {
                if (isMatch) {
                    const tokenPayload = {
                        username: user.username,
                        id: user._id,
                    };

                    const tokenHeaders = { expiresIn: '60 days' };
                    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, tokenHeaders);

                    // Send the user their authentication token and then redirect the user to their profile
                    res.cookie('lhAuth', token, { maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true });
                    res.locals.profile = user;
                    return res.redirect(`/users/${user.username}`);
                }
                return res.status(403).render('login', res.locals);
            });
        })
        .catch(err => res.status(500).render('login', res.locals));
});

// Sign the user out
router.get('/signout', (req, res) => {
    res.clearCookie('lhAuth');
    res.redirect('/');
});

module.exports = router;
