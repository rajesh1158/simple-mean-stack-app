const express = require('express');
const router = express.Router();

const passportMiddleware = require('../middleware/passport');

router.post('/', (req, res, next) => {
	passportMiddleware.validateLogin(req, res, next);
});

module.exports = router;
