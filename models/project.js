const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

var projectSchema = new Schema({
    title: String, 
    date: {type: Date, default: Date.now},
    requirements: {
        keywords: [String],
        experience: Number,
        languages: [String],
        verification: Boolean,
    },
    candidates: [{id: mongoose.ObjectId, name: String}],
    collaborators: [{unique_id: Number, name: String}],
    teamSize: Number,
    acceptingNewMembers: Boolean,
    languages: [String],
    description: String, 
    hidden: Boolean,
    meta: {
        viewsCount: Number, 
        amountOfUsersInterested: Number,
    }
})

var Project = mongoose.model('Project', projectSchema);

module.exports = Project;