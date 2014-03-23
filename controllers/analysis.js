var db = require('../db');

module.exports = {

	byJudge: function(req, res){
		db.Judge.findOne({ '_id': req.params.id }).populate('_analyses').exec(function(err, judge){
			res.locals.judge = judge;
			res.render('analysis/byJudge.ejs');
		});
	}

};