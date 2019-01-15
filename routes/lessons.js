const express = require('express');
const Lesson = require('../models/lesson');

const authorize = require('../lib/authorize');

const router = express.Router({ mergeParams: true });

router.get('/', authorize, (req, res, next) => {
    const curriculumId = res.locals.curriculumId;
    Lesson
        .find({ curriculumId })
        .then((lessons) => {
            res.locals.lessons = lessons;
            res.render('lessons', res.locals);
        })
        .catch(err => next(err));
});

router.get('/:lessonId', authorize, (req, res, next) => {
    Lesson
        .find({ req.params.lessonId })
        .then((lesson) => {
            res.locals.lesson = lesson;
            res.render('lesson', res.locals)
        })
        .catch(err => next(err));
});

router.post('/', authorize, (req, res, next) => {
    User
        .findOne({ name: req.params.username })
        .then((user) => {
            if (user.username === res.locals.username) {
                return Curriculum.findOne({ _id: res.locals.curriculum._id })   
            }            }
    })
}
        .catch(err => next(err));
});
