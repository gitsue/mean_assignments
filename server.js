// require express and path
var express = require("express");
var path = require("path");
// create the express app
var app = express();
var bodyParser = require('body-parser');

// static content 
app.use(express.static(path.join(__dirname, "./static")));
// handling form data
app.use(bodyParser.urlencoded({extended: true}));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view
app.get('/', function(req, res) {
	User.find({}, function(error, users){
		if(!error){
			console.log(users);
			res.render('index', {user: users});
		}
		else {
			console.log('There is an error finding users');
			res.render('index');
		}
	});
});

app.post('/users', function(req, res){
	console.log('POST DATA', req.body);
	var user = new User({name: req.body.name, age: req.body.age});
	user.save(function(error){
		if(error){
			console.log('Something went wrong');
		}
		else {
			console.log('Added a User!');
			res.redirect('/');
		}
	});
});
// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
});

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/intro_mongoose');

var UserSchema = new mongoose.Schema({
	name: String,
	age: Number
});

mongoose.model('User', UserSchema);
var User = mongoose.model('User');

