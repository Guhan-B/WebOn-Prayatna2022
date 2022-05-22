const mongoose = require('mongoose');

const Schema = mongoose.Schema;

exports.ConnectToDatabase = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    return conn;
}

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    inr: {
        type: Number,
        default: 10000
    },
    xrp: {
        type: Number,
        default: 0
    },
    eth: {
        type: Number,
        default: 0
    },
    trx: {
        type: Number,
        default: 0
    },
    eos: {
        type: Number,
        default: 0
    },
});

const transactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    fromCoin: {
        type: String,
        required: true,
    },
    toCoin: {
        type: String,
        required: true,
    },
    fromAmount: {
        type: Number,
        required: true,
    },
    toAmount: {
        type: Number,
        required: true,
    },
})

const tokenSchema = new Schema({
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

exports.Models = {
    User: mongoose.model('User', userSchema),
    Token: mongoose.model('Token', tokenSchema),
    Transaction: mongoose.model('Transaction', transactionSchema),
}