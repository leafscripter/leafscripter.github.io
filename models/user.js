const mongoose = require('mongoose');
const Schema  = mongoose.Schema; 

var interestObject = {
	keywords: String, 
	languages: [String],
	experience: Number,
}

var userSchema = new Schema({
	email: String,
	country: String, 
	languages: [String],
	description: String,
	interests: [interestObject],
	likedProjects: [{id: mongoose.ObjectId}],
	hiddenAttributes: [{name: Boolean, email: Boolean}],
	verified: Boolean,
	username: String,
	password: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;