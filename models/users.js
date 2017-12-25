var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var schema = new Schema({
	username: {type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: false},
	firstname: {type: String, required: false},
	lastname: {type: String, required: false},
	type: {type: String, required: true}
});

schema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

schema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', schema);