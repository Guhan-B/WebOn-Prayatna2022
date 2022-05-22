const { validationResult } = require('express-validator');

const { Models } = require('../database/Database');
const { ServerError } = require('../utility/error');

exports.portfolio = async (req, res, next) => {  
    try {
        const transactions = await Models.Transaction.find({
            'userId': { $in: [
                req.user._id
            ]}
        });

        return res.status(200).json(transactions);
    }
    catch(e) {
        console.log(e);
        return next(new ServerError('Unable to process request', 500, 'INTERNAL_SERVER_ERROR'));
    }
}

exports.exchange = async (req, res, next) => {    
    console.log(req.body);
    try {
        const user = await Models.User.findById(req.user._id);

        if(user[req.body.from.coin] < req.body.from.amount)
        return next(new ServerError('Insufficiant balence', 403, 'FORRBIDEN'))

        console.log(user[req.body.from.coin]);
        console.log(user[req.body.to.coin]);

        user[req.body.from.coin] -= req.body.from.amount
        user[req.body.to.coin] += req.body.to.amount

        await user.save()

        const transaction = await Models.Transaction({
            fromCoin: req.body.from.coin,
            toCoin: req.body.to.coin,
            fromAmount: req.body.from.amount,
            toAmount: req.body.to.amount,
            userId: req.user._id
        })

        await transaction.save()

        return res.status(200).json(transaction);
    }
    catch(e) {
        console.log(e);
        return next(new ServerError('Unable to process request', 500, 'INTERNAL_SERVER_ERROR'));
    }

}

exports.me = async (req, res, next) => {
    try {
        const me = {};

        return res.status(200).json({});
    } catch (e) {
        console.log(e);
        return next(new ServerError('Unable to process request', 500, 'INTERNAL_SERVER_ERROR'));
    }
}