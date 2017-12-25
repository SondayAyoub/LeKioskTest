var passport = require('passport');
var User = require('../models/users');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

passport.use('local.signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
}, function(req, username, password, done){
	req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
	req.checkBody('password', 'Short password, min 8 caractere!').notEmpty().isLength({min:8});
	var errors = req.validationErrors();	
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'username': username}, function(err, user){
		if(err){
			return done(err);
		}
		if(user){
			return done(null, false, {message: 'username is already exist!'});
		}
		var newUser = new User();
		newUser.username = username;
		newUser.type = 'Client';
		newUser.password = newUser.encryptPassword(password);
		newUser.email = req.body.email;
		newUser.firstname = req.body.firstname;
		newUser.lastname = req.body.lastname;
		newUser.save(function(err, ress){
			if(err){
				return done(err);
			}
			return done(null, newUser);
		});
	});
}));

passport.use('local.signin', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true

}, function(req, username, password, done){
	console.log(req.email);
	//req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
	req.checkBody('password', 'Short password').notEmpty().isLength({min:4});
	var errors = req.validationErrors();	
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		return done(null, false, req.flash('error', messages));
	}
	User.findOne({'username': username}, function(err, user){
		if(err){
			return done(err);
		}
		if(!user){
			return done(null, false, {message: 'Username not found!'});
		}
		if(!user.validPassword(password)){
			return done(null, false, {message: 'Wrong password!'});
		}
		return done(null, user);
	});


	}));