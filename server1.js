var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNext = 1;
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

app.use( bodyParser.json());
app.get('/',(function ( req,res) {

		res.send ('Login API root');
	}) 
);


app.post('/user', function(req,res) {

		var body= _.pick(req.body,'email','password');
	
			db.user.create(body)
			.then(function(item) {
				console.log(item);
				res.json(item.toJSON());					
			},function (e) {
				res.json(e);
				// res.json(e);
			});
  })


 db.sequelize.sync().then( function() {
 			app.listen( PORT, function() {
			console.log('server listning port : ' + PORT);
	})

 })