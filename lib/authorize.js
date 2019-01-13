module.exports = (req, res, next) => {
    if (res.locals.user) {
        return next();
    }

    return res.status(403).render('unauthorized', res.locals);
};
