const express = require('express');
const path = require('path');
const router = express.Router();
const passportMiddleware = require('../middleware/passport');

router.get('/', passportMiddleware.doLoginCheck, (req, res, next) => {
	res.sendFile('index.html', { root: path.join(__dirname, '../pages') });
});

router.get('/index.html', passportMiddleware.doLoginCheck, (req, res, next) => {
	res.sendFile('index.html', { root: path.join(__dirname, '../pages') });
});

router.get('/logout', async (req, res, next) => {
	await req.logout();
	res.clearCookie('jwt', {path: '/', httpOnly: true});
	return res.redirect('/');
});

router.get('/home', passportMiddleware.doLoginCheck, (req, res, next) => {
	res.sendFile('home.html', { root: path.join(__dirname, '../pages') });
});

module.exports = router;
