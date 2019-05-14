const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');
const JWTStrategy = passportJWT.Strategy;
const bcrypt = require('bcrypt');

const UserModel = require('../models/user');
const passportConfig = require('../config/passport');

passport.use('login', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	session: false
}, async(username, password, done) => {
	try {
		const userDocument = await UserModel.findOne({username: username}).exec();
		if(!userDocument) {
			return done('Incorrect username or password');
		}

		const passwordsMatch = bcrypt.compareSync(password, userDocument.passwordHash);
		if(passwordsMatch) {
			return done(null, userDocument);
		} else {
			return done('Incorrect username or password');
		}
	} catch(error) {
		console.log(error);
		return done('An error occurred while authentication');
	}
}));

passport.use('registration', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	session: false
}, async(username, password, done) => {
	try {
		const userDocument = await UserModel.findOne({username: username}).exec();
		if(userDocument) {
			return done('Username already exists');
		}

		const hash = bcrypt.hashSync(password, 10);
		const newUserDocument = new UserModel({username: username, passwordHash: hash});
		try {
			const savedUser = await newUserDocument.save();
			return done(null, true);
		} catch(ex) {
			return done('Unable to create user');
		}
	} catch(error) {
		console.log(error);
		return done('An error occurred while registration');
	}
}));

passport.use('user', new JWTStrategy({
	jwtFromRequest: req => req.cookies.jwt,
	secretOrKey: passportConfig.secret,
}, async (jwtPayload, done) => {
	if(!jwtPayload || !jwtPayload.username) {
		return done('Authentication token is invalid');
	}

	const userDocument = await UserModel.findOne({username: jwtPayload.username}).exec();
	if(!userDocument) {
		return done('Authentication token is invalid');
	}

	if(!jwtPayload.expires || Date.now() >= jwtPayload.expires) {
		return done('Authentication token expired');
	}

	return done(null, jwtPayload);
}));

const validateRegistration = (req, res, next) => {
	passport.authenticate('registration', { session: false }, (error, isUserCreated) => {
		if(error) {
			res.status(400).json({ error: error });
			return;
		}

		res.status(200).send({success: true});
	})(req, res);
};

const doLoginCheck = (req, res, next) => {
	passport.authenticate('user', { session: false }, (error, payload) => {
		if(!payload && req.path != '/index.html' && req.path != '/') {
			res.redirect('/');
		} else if(payload && (req.path == '/' || req.path == '/index.html')) {
			res.redirect('/home');
		} else {
			next();
		}
	})(req, res);
};

const validateLogin = (req, res, next) => {
	passport.authenticate('login', { session: false }, (error, user) => {
		if(error) {
			res.status(400).json({ error: error });
			return;
		}

		/** This is what ends up in our JWT */
		const payload = {
			username: user.username,
			expires: Date.now() + parseInt(passportConfig.expirationMillis)
		};

		/** assigns payload to req.user */
		req.login(payload, {session: false}, (error) => {
			if(error) {
				console.log(error);
				res.status(400).send({ error: "Unable to login" });
				return;
			}

			/** generate a signed json web token and return it in the response */
			const token = jwt.sign(JSON.stringify(payload), passportConfig.secret);

			/** assign our jwt to the cookie */
			res.cookie('jwt', token, { path: '/', httpOnly: true, maxAge: 604800000 }); //7 days
			res.status(200).send({success: true});
		});
	})(req, res);
};

module.exports = {
	doLoginCheck, validateLogin, validateRegistration
};
