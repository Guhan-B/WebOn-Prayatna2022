const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const sendGrid = require('@sendgrid/mail');
const moment = require('moment');

const { Models } = require('../database/Database');
const { ServerError } = require('../utility/error');
const { generateAccessTokens, generateRefreshTokens }= require('../utility/tokens');

exports.login = async (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
        return next(new ServerError('Validation failed', 422, 'VALIDATION_FAILED', err.array()));
    }

    try {
        const user = await Models.User.findOne({
            email: req.body.email
        });

        if (!user) {
            return next(new ServerError('Email does not exist', 401, 'RESOURCE_NOT_FOUND'));
        }

        const isPasswordSame = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordSame) {
            return next(new ServerError('Password does not match', 401, 'AUTHENTICATION_FAILED'));
        }

        const accessToken = generateAccessTokens({ userId: user._id });
        const refreshToken = generateRefreshTokens({ userId: user._id }, user.password);

        const newToken = new Models.Token({
            userId: user._id,
            refreshToken: refreshToken
        });

        await newToken.save();

        res.status(200).json({
            user: user,
            accessToken,
            refreshToken,
            expiresAt: moment().add(15, 'm').toISOString(),
            verified: true
        });
    } catch (e) {
        return next(new ServerError('Unable to process request', 500, 'INTERNAL_SERVER_ERROR'));
    }
}

exports.register = async (req, res, next) => {
    console.log("Register");
    const err = validationResult(req);


    if (!err.isEmpty()) {
        return next(new ServerError('Validation failed', 422, 'VALIDATION_FAILED', err.array()));
    }

    try {
        const isUserAvalible = await Models.User.findOne({
            email: req.body.email
        });

        console.log(isUserAvalible);

        if (isUserAvalible) {
            return next(new ServerError('Email already exist', 409, 'RESOURCE_EXISTS'));
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = new Models.User({
            name: req.body.email.split('@')[0],
            email: req.body.email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Proceed to email verification",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                avatar: newUser.avatar
            },
        });
    } catch (e) {
        console.log(e);
        return next(new ServerError('Unable to process request', 500, 'INTERNAL_SERVER_ERROR'));
    }
}

exports.logout = async (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
        return next(new ServerError('Validation failed', 422, 'VALIDATION_FAILED', err.array()));
    }

    try {
        const token = await Models.Token.findOne({
            userId: req.user._id,
            refreshToken: req.body.refreshToken
        });

        if (!token) {
            return next(new ServerError('Unable to logout', 403, 'FORBIDDEN'));
        }

        await token.delete();

        res.status(200).json({
            message: "logout success"
        });
    } catch (e) {
        console.log(e);
        return next(new ServerError('Unable to process request', 500, 'INTERNAL_SERVER_ERROR'));
    }
}

exports.refresh = async (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
        return next(new ServerError('Validation failed', 422, 'VALIDATION_FAILED', err.array()));
    }

    let user, refreshToken = req.get('Authorization');

    if (!refreshToken) {
        return next(new ServerError('Refresh token Missing', 401, 'AUTHORIZATION_FAILED'));
    }

    refreshToken = refreshToken.split(' ')[1];

    try {
        user = await Models.User.findOne({
            _id: req.body.userId
        });
    } catch (e) {
        console.log(e);
        return next(new ServerError('Unable to process request', 500, 'INTERNAL_SERVER_ERROR'));
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY + user.password, async (err, decoded) => {
        if (err) {
            return next(new ServerError("Refresh Token error - " + err.message, 401, 'AUTHORIZATION_FAILED'));
        } else {
            try {
                const savedRefreshToken = await Models.Token.findOne({
                    userId: user._id,
                    refreshToken: refreshToken
                });

                console.log(savedRefreshToken);
                console.log(decoded);

                if (savedRefreshToken && savedRefreshToken.userId == decoded.userId) {
                    const accessToken = generateAccessTokens({ userId: user._id });
                    res.status(200).json({
                        accessToken,
                        expiresAt: moment().add(15, 'm').toISOString()
                    });
                } else {
                    return next(new ServerError("Refresh token invalid", 401, 'AUTHORIZATION_FAILED'));
                }
            } catch (e) {
                console.log(e);
                return next(new ServerError('Unable to process request', 500, 'INTERNAL_SERVER_ERROR'));
            }
        }
    });
}