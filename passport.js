var passport = require('passport');
var db = require('./db');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done){
	console.log("serialize: " + user._id);
	done(null, user._id);
});

passport.deserializeUser(function(id, done){
	console.log("deserialize: " + id);
	db.User.findById(id, function(err, user){
		console.log(user);
		done(err, user);
	});
});

passport.use(new LocalStrategy(function(username, password, done){
	console.log("aa");
	db.User.findOne({ username: username }, function(err, user){
		if(err) return done(err);
		if(!user) return done(null, false, { message: "未知使用者：" + username });
		user.comparePassword(password, function(err, isMatch){
			if(err) return done(err);
			if(isMatch){
				return done(null, user);
			} else {
				return done(null, false, { message: "密碼錯誤。" });
			}
		});
	});
}));

exports.checkAuth = function checkAuth(req, res, next){
	if(req.isAuthenticated()) return next();
	res.redirect('/login');
}

exports.checkAdmin = function checkAdmin(req, res, next){
	console.log(req.user);
	if(req.user && req.user.type === 3) next();
	else res.send(403);
}