var passport = require('passport');

module.exports = {

	login: function(req, res){
		res.render('login', { message: req.flash('error') });
	},
	
	logout: function(req, res){
		req.logout();
		res.redirect('/');
	},
	
	register: function(req, res){
		res.render('register');
	},
	
	doRegister: function(req, res){
		new db.User({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
			type: 1,
			nickname: req.body.nickname,
			registerDate: Date.now()
		}).save(function(err, user){
			req.flash('error', req.body.username + '註冊成功！');
			res.redirect('/login');
		});
	}

};