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

			res.send ('todo API root');
		})
);

app.get('/todo',function (req,res) {
			var queryParams = req.query;
			var where = {}
			if( queryParams.hasOwnProperty('completed') && queryParams.completed == 'true'){
					where.completed = true;

			}  else if ( queryParams.hasOwnProperty('completed') && queryParams.completed == 'false'){
					where.completed = false;	

				} 

			if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
					where.description = {  
						$like :'%'+queryParams.q+'%'
					};		
			} 

				db.todo.findAll ({ 		
						where: where 
					})
				.then(function (todos) { 
						res.json(todos);
				}, function (e) {
						res.status(404).json(e);
					});
});

app.get('/todos/:id',function (req,res) {

			var todoId = parseInt(req.params.id,10); // or convert it into int parseInt
			
			db.todo.findById(todoId).then(function(todo) {

				if(!!todo){
					res.json(todo.toJSON());

				} else {
						res.status(404).json(e);
					}

			},function(e) {
				res.status(500);
			}).catch( function(e) {
						res.status(400).json(e);
			})

});

app.post('/todos',function (req,res) {
	var  body = _.pick(req.body,'description','completed');

			db.todo.create(body).then(function(todo) {
					res.json(todo.toJSON());
					console.log('in first promise');
			}).catch(function (e) {
				res.status(400).json(e);
			}); 
})

app.delete('/delete/:id', function (req,res) {

		var todoId = parseInt( req.params.id, 10);

		db.todo.destroy({
				    where: {
				    	id: todoId
				            }
				}).then(function (rowsDel){
					if(rowsDel === 0){
						res.status(404).json(e);
					}else{
						res.status(204).json(e);
					}

						}, function (e){

					res.status(500).json(e);

				})
});


 app.put('/update/:id', function (req, res) {

 				//var updateId = parseInt(req.params.id, 10);
 		 var todoId = parseInt( req.params.id, 10);
 		 //var matchtodoId = _.findWhere( todos ,{id: todoId});
 		 var body = _.pick( req.body,'description','completed');
 		 var attributes ={};


 		 if (body.hasOwnProperty('completed')) {
 		 		 attributes.completed = body.completed; 
 		 } 

 		 if (body.hasOwnProperty('description')){
 		 	 attributes.description = body.description;

 		 } 

 		 db.todo.findById(todoId).then( function (todo){
 		 		if (todo){
 		 			return todo.update(attributes).then(function(todo) {
 		 					res.json(todo.toJSON());

 					 },function(e){
 		 					res.status(400).json(e);
 							 });
 		 		} else{

 		 				res.status(404);
 		 		}

		 		 },function () {
		 		 	res.status(500).json(e);
		 		 });

 });

 app.post('/user', function(req,res) {

		var body= _.pick(req.body,'email','password');
	
			db.user.create(body)
			.then(function(item) {
				console.log(item);
				res.json(item.toJSON());					
			},function (e) {
				res.status(400).json(e);
				
				});
 });

db.sequelize.sync({ force : true}).then( function() {
 			app.listen( PORT, function() {
			console.log('server listning port : ' + PORT);
	})

});