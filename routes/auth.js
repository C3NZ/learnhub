const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Get the sign up form for the user
router.get('/signup', (req, res) => {
    res.render('signup', res.locals);
})

// Get the login form for the user
router.get('/login', (req, res) => {
    res.render('login', res.locals)
});

