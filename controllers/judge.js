var db = require('../db');

module.exports = {

	create: function(req, res){
		res.render('judge/create.ejs');
	},
	
	doCreate: function(req, res){
		new db.Judge({
			name: req.body.name,
			abbr: req.body.abbr,
			homePage: req.body.home_page,
			problemPage: req.body.problem_page,
			addDate: Date.now(),
			lastUpdate: Date.now(),
			translates: [],
			analyses: []
		}).save(function(err, judge){
			res.redirect('/');
		});
	}

};