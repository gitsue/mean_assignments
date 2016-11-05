var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var port = 8000;
var path = require('path');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/msg_board');
var Schema = mongoose.Schema;
var UserSchema = new mongoose.Schema({
	name: {type: String, required: true, minlength: 4},
	msg : {type: String, required: true},
	comment: {
		name: String,
		comment: String
	}
}, {timestamps: true});

mongoose.model('User', UserSchema);
var User = mongoose.model('User');

//***************** Routes ***********************************
app.get('/', function(req, res){
	User.find({}, function(error, users){
		if(error){
			console.log("Unable to find users");
		}
		else {
			console.log(users);
			res.render('index', {data: users});
		}
	});

});

app.post('/users', function(req, res){
	console.log("POST DATA", req.body);
	var user = User.create(req.body, function(error){
		if(error){
			console.log("Could not create user");
			console.log(error);
			res.redirect('/');
		}
		else{
			console.log("User entry created!");
			res.redirect('/');
		}
	});

});

app.post('/comments', function(req, res){
	User.update({_id: req.body.user_id}, {$push:{comment: {name: req.body.name, comment: req.body.comment}}}, function(error, result){
		if(error){
			console.log(error);
			console.log("Cannot find user");
			res.redirect('/');
		}
		else {
			console.log("User entry updated!");
			res.redirect('/');
		}
	});
})


var server = app.listen(port, function(){
	console.log("listening on port: " + port);
});