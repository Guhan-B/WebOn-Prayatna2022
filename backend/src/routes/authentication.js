const express = require('express');
const { body } = require('express-validator');

const { login, register, logout, refresh } = require('../controllers/authentication');
const { accessHandler } = require('../middlewares/authentication');

const router = express.Router();

router.post(
    '/login',
    [
        body('email')
            .trim()
            .isEmail()
            .withMessage("email badly formated")
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 6 })
            .withMessage("Passowrd should be minimum 6 characters long")
    ],
    login
);

router.post(
    '/register',
    [
        body('email')
            .trim()
            .isEmail()
            .withMessage("email badly formated")
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 6 })
            .withMessage("Passowrd should be minimum 6 characters long"),
    ],
    register
);

router.delete(
    '/logout',
    accessHandler,
    [
        body('refreshToken')
            .trim()
            .notEmpty()
            .withMessage("Refresh token required"),
    ],
    logout
);

router.post(
    '/refresh',
    [
        body('userId')
            .trim()
            .notEmpty()
            .withMessage('User id required')
    ],
    refresh
);

module.exports = router;