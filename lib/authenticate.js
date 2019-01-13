const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (!req.cookies.lhAuth) {
        res.locals.user = null;
    } else {
        const token = req.cookies.lhAuth;
        const decodedToken = jwt.decode(token, { complete: true }) || {};
        res.locals.user = decodedToken.payload;
    }
    return next();
};
