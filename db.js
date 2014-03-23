var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

mongoose.connect('mongodb://localhost/seven');

var Schema = mongoose.Schema;
var judgeSchema = Schema({
	name: String,
	abbr: String,
	homePage: String,
	problemPage: String,
	translates: [{ type: Schema.Types.ObjectId, ref: 'Transtate' }],
	analyses: [{ type: Schema.Types.ObjectId, ref: 'Analysis' }]
});

var translateSchema = Schema({
	name: String,
	content: String,
	problemId: String,
	addDate: Date,
	lastUpdate: Date,
	_source: { type: Schema.Types.ObjectId, ref: 'Judge' },
	_author: { type: Schema.Types.ObjectId, ref: 'User' }
});

var analysisSchema = Schema({
	name: String,
	content: String,
	code: String,
	problemId: String,
	addDate: Date,
	lastUpdate: Date,
	_source: { type: Schema.Types.ObjectId, ref: 'Judge' },
	_author: { type: Schema.Types.ObjectId, ref: 'User' }
});

var userSchema = Schema({
	username: String,
	password: String,
	email: String,
	type: Number,
	nickname: String,
	registerDate: String
});

// Encrypt password before save
userSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb){
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

exports.Judge = mongoose.model('Judge', judgeSchema);
exports.Translate = mongoose.model('Translate', translateSchema);
exports.Analysis = mongoose.model('Analysis', analysisSchema);
exports.User = mongoose.model('User', userSchema);