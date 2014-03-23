// Library
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var redisTag = require('redis-tag');
var flash = require('connect-flash');

// Database
var db = require('./db');
var pass = require('./passport');

// Controllers
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var judgeController = require('./controllers/judge');
var translationController = require('./controllers/translation');
var analysisController = require('./controllers/analysis');

// Express configuration
var app = express();
app.configure(function(){
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.locals({
	title: 'SEVEn!'
});

// Common actions
app.get('*', function(req, res, next){
	db.Judge.find(function(err, judges, count){
		res.locals.judges = judges;
		res.locals.user = req.user;
		next();
	});
});

// Routing
app.get('/', homeController.home);
app.get('/login', userController.login);
app.post('/login', passport.authenticate('local', { session: true, successRedirect: '/', failureRedirect: '/login', failureFlash: true}));
app.get('/register', userController.register);
app.post('/register', userController.doRegister);
app.get('/logout', pass.checkAuth, userController.logout);
app.get('/translation/byJudge/:id', translationController.byJudge);
app.get('/analysis/byJudge/:id', analysisController.byJudge);
app.get('/judge/create', judgeController.create);
app.post('/judge/create', judgeController.doCreate);

// Start server to listen
var server = app.listen(3000, function(){
	console.log('Listening on port %d', server.address().port);
});
