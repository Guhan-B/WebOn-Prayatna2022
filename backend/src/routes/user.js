const express = require('express');

const { me, exchange, portfolio } = require('../controllers/user');

const router = express.Router();


router.get('/me', me);
router.get('/portfolio', portfolio);
router.post('/exchange', exchange)



module.exports = router;