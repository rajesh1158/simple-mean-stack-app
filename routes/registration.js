const express = require('express');
const router = express.Router();
const path = require('path');
const cookieParser = require('cookie-parser');
const passportMiddleware = require('../middleware/passport');

router.get('/', (req, res, next) => {
	if(req.cookies && req.cookies.jwt) {
		res.redirect('/home');
	} else {
		res.sendFile('registration.html', { root: path.join(__dirname, '../pages') });
	}
});

router.post('/', (req, res, next) => {
	passportMiddleware.validateRegistration(req, res, next);
});

module.exports = router;
