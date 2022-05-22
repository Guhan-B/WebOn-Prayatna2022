const jwt= require('jsonwebtoken');

exports.generateAccessTokens = (payload) => {
    const token = jwt.sign(
        {
            userId: payload.userId,
            type: 'ACCESS',
            timestamp: Date.now()
        },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: '1y'
        }
    );
    return token;
}

exports.generateRefreshTokens = (payload, extra) => {
    const token = jwt.sign(
        {
            userId: payload.userId,
            type: 'REFRESH',
            timestamp: Date.now()
        },
        process.env.REFRESH_TOKEN_KEY + extra,
        {
            expiresIn: '1y'
        }
    );
    return token;
}