const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const cookieParser = require('cookie-parser');
const path = require('path');

app.set('view engine', 'html');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

require('./db');

const index = require('./routes/index');
const login = require('./routes/login');
const registration = require('./routes/registration');

// caching disabled for every route
app.use(function(req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});

app.use('/', index);
app.use('/login', login);
app.use('/registration', registration);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.status(404);

	// respond with html page
	if(req.accepts('html')) {
		res.sendFile(path.join(__dirname + '/public/404.html'));
		return;
	}

	// respond with json
	if(req.accepts('json')) {
		res.send({ err: 'Not found' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Not found');
});

// error handler
app.use(function(err, req, res, next) {
	console.log(err);
	var status = err.status || 500;
	res.status(status);

	// respond with html page
	if(req.accepts('html')) {
		res.sendFile(path.join(__dirname + '/public/error.html'));
		return;
	}

	// respond with json
	if(req.accepts('json')) {
		res.send({ err: 'Error occurred' });
		return;
	}

	// default to plain-text. send()
	res.type('txt').send('Error occurred');
});

app.listen(8080, function() {
	console.log('App listening on port 8080!')
});
