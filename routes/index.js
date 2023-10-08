const express = require('express');
// const recommend = require('collaborative-filter')
const router = express.Router();
const User = require('../models/user');
const Project = require('../models/project');

const PROJECT_LIMIT = 10;

// var mR = math.matrix() // use this for the recommendation algorithm

//commented these out because the server wouldn't start

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', async function(req, res, next) {
    console.log(req.body);
	res.setHeader('content-type', 'text/plain');
	if(await User.findOne({$or: [{email: req.body.email}, {username: req.body.username}]})){
		res.send(JSON.stringify({ok: false, err: 'A user is already registered under this username or email.'}));
		return;
	}
	await User.create({
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});
	res.send(JSON.stringify({ok: true}));
});

router.post('/likeProject', function (req, res) {
	var personInfo = req.body;


	// Implement following functionality: 
	// Check if the user has already liked the post
	//
}) 



router.get('/getProjects', async (req, res) => {
	let projects = await Project.find({})
		.limit(PROJECT_LIMIT)
		.sort({date: -1}); // sort by date in descending ordero

	res.json({projects}) 
})

router.get('/recommendProjects', async (req, res) => {
	const recommendation = await Project.aggregate([
		{$match: {generalCategories: {}}}
	]);
})

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

router.post('/login', async function(req, res, next) {
	res.setHeader('content-type', 'text/plain');
    const user = await User.findOne({username: req.body.username});
	if (!user)
		return res.send(JSON.stringify({ok: false, err: "User not found"}));
	
	if(req.body.password == user.password)
		return res.send(JSON.stringify({ok: true}));
	
	res.send(JSON.stringify({ok: false, err: "Invalid username or password"}));
});

router.get('/profile', async function (req, res, next) {
	console.log("profile");
	const user = await User.findOne({unique_id:req.session.userId});
	if(!user)
		return res.redirect('/');
	
	res.render('user.ejs', {user: user});
});

router.get('/logout', function (req, res, next) {
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});

router.post('/forgetpass', async function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	const user = await User.findOne({email:req.body.email});
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	
});

router.get('/chat', function (req, res, next) {
	res.render("chat.ejs");
});

(() => {
	const connections = [];
	
	router.ws('/chat', function (ws, req) {
		
		// store connection for further use
		connections.push(ws);
		// store index of connection for later removal
		ws.connection_index = connections.length - 1;
		
		ws.on('message', async function (msg) {
			console.log('new message:', msg);
			// send message to all connected users
			for(let i of connections){
				i.send(msg);
			}
		});
		
		// remove the connection from the array when it closes
		ws.on('close', function() {
			connections.splice(ws.connection_index, 1);
		});
	});
})();

router.get('/home', function(req, res, next) {
	let dummy_data = {
		users: [
			{username: "john_john",
			description: "John Smith, BSc\nA student pursuing a Master's degree in Biology at the University of Oslo."},
			
			{username: "mary_01",
			description: "Mary Robertson, Ph.D\nPhysics professor at the University of Manitoba"},
			
			{username: "alua",
			description: "Alua Ivanovna\nCEO of MarineOne Co."}
		],
		
		projects: [
			{name: 'Creating a Deep Learning algorithm to correctly identify brain tumors',
			meta: {viewsCount: 25, amountOfUsersInterested: 3}
			},
			
			{name: 'Investigating a new type of bacteria found in the Antarctic',
			meta: {viewsCount: 1233, amountOfUsersInterested: 704}
			},
			
			{name: 'Using carbon fiber technology in architecture',
			meta: {viewsCount: 401003, amountOfUsersInterested: 70122}
			}]
	};
	res.render("home.ejs", dummy_data);
});

module.exports = router;