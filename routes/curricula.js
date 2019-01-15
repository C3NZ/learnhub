const express = require('express');

const User = require('../models/')
const Curriculum = require('../models/curriculum');
const Lesson = require('../models/lesson');

const authorize = require('../lib/authorize');

const lessonsRouter = require('./lessons');
const assignmentsRouter = require('./assignments');

const router = express.Router({ mergeParams: true });

// Get all curricula from a user
router.get('/', (req, res, next) => {
    Curriculum
        .find()
        .then((curricula) => {
            if (curricula) {
                res.locals.curricula = curricula;
            }

            res.render('curricula', res.locals);
        })
        .catch(err => next(err));
});

// Get a single curriculum from a user
router.get('/:name', (req, res, next) => {
    Curriculum
        .findOne({ name: req.params.name })
        .then((curriculum) => {
            if (curriculum) {
                res.locals.curriculum = curriculum;
            }

            res.render('curricula', res.locals)
        })
        .catch(err => next(err));
});

// Render the new form to the user
router.get('/new', authorize, (req, res, next) => {
    res.render('create-curriculum', res.locals);
})

// Create a new curriculum for a specific user
router.post('/', authorize, (req, res, next) => {
    User
        .findOne({ name: req.params.username })
        .populate('curricula')
        .then((user) => {
            if (user.username === res.locals.username) {
                const totalCurricula = user.curricula.length;
                for (let i = 0; i < totalCurricula; i += 1) {
                    if (user.curricula[i].name === req.body.name) {
                        return res.status(403).render('error');
                    }
                }
                
                // Attach the user to the body and then create the curriculum
                req.body.creator = user;
                Curriculum
                    .create(req.body)
                    .then((curriculum) => {
                        return res.redirect(`/users/${user.username}/c/${curriculum.name}`)
                    })
                    .catch(err => next(err));
            } else {
                res.locals.errorMessage = 'You are not authorized to complete this action'
                return res.status(403).render('error', res.locals)
            }
        })
        .catch(err => next(err));
});

// Update a pre existing curriculum
router.put('/:name', authorize, (req, res, next) => {
    User
        .findOne({ name: req.params.username })
        .then((user) => {
            if (user.username === res.locals.username) {
                Curriculum
                    .updateOne({ name: req.body.name }, req.body)
                    .then((curriculum) => {
                        return res.redirect(`/users/${user.username}/c/${curriculum.name}`);
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
});


// Delete a pre existing curriculum
router.delete('/:name', authorize, (req, res, next) => {
    User
        .findOne({ name: req.params.username })
        .then((user) => {
            if (user.username === res.locals.username) {
                Curriculum
                    .deleteOne({ name: req.body.name })
                    .then((curriculum) => {
                        return res.redirect(`/users/${user.username}/c`);
                    })
                    .catch(err => next(err));
            }
        })
        .catch(err => next(err));
});


router.use((req, res, next) => {
    if (req.params.lessonName || req.params.assignmentName) {
        Curriculum
            .findOne({ name: req.body.name })
            .then((curriculum) => {
                res.locals.curriculum = curriculum;
                return next();
            })
            .catch(err => next(err));
    } else {
        next();
    }

})

router.use('/lessons', lessonsRouter);
router.use('/assignments', assignmentsRouter);
