const { v4 } = require('uuid');

const error = (err, req, res, next) => {
    const error = {
        _id: v4(),
        message: err.message,
        code: err.code,
        errors: err.errors,
    };
    console.log(error);
    res.status(err.status).json({ error });
}

module.exports = error;