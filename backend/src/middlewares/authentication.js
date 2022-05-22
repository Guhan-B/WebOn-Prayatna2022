const jwt = require('jsonwebtoken');

const { Models } = require('../database/Database');
const { ServerError } = require('../utility/error');

exports.accessHandler = async (req, res, next) => {
    console.log('[AUTH MIDDELWARE RUNNING]');

    let token = req.get('Authorization');

    if (!token) {
        return next(new ServerError('Access token Missing', 401, 'AUTHORIZATION_FAILED'));
    }

    token = token.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async (err, decoded) => {
        if (err) {
            return next(new ServerError("Token error - " + err.message, 401, 'AUTHORIZATION_FAILED'));
        } else {
            try {
                const user = await Models.User.findOne({ _id: decoded.userId });
                req.user = user;
                next();
            } catch (e) {
                return next(new ServerError('Unable to process request', 500, 'INTERNAL_SERVER_ERROR'));
            }
        }
    });
}