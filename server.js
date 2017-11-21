var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNext = 1;
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
/*{
	id:1,
	description: 'leave home by 7:30',
	done:false
},
{
	id:2,
	description: 'Have breakfast',
	done:false
},
{

	id:3,
	description: 'go to market',
	done:true
}*/

app.use( bodyParser.json());
app.get('/',(function ( req,res) {

		res.send ('todo API root');
	}) 
);

app.get('/todo',function (req,res) {

		var queryParams = req.query;
		var filteredObj = todos;

		if( queryParams.hasOwnProperty('completed') && queryParams.completed == 'true'){

			filteredObj = _.where( todos, { completed:true});
			// res.json(filteredObj);

		} else if ( queryParams.hasOwnProperty('completed') && queryParams.completed == 'false'){

			filteredObj = _.where( todos, { completed:false});
			// res.json(filteredObj);
		} 

		 if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
 
			filteredObj = _.filter(todos, function (todo) {

			return  todo.description.indexOf(queryParams.q) > -1;
		})
		}

				res.json(filteredObj);
				
});

app.get('/todos/:id',function (req,res) {

	var todoId = parseInt(req.params.id,10); // or convert it into int parseInt
	var matchId = _.findWhere(todos, {id: todoId});

	/*var matchId;
	console.log(todoId);

	todos.forEach(function (todo) {

		console.log(todo);

		// var id1= todo.id; // to
		if(todoId == todo.id){ // ===

			console.log(todo);
			matchId = todo;
		}
	});
*/
	if (matchId){ 

		res.json(matchId);
	}else {

		res.sendStatus('not found');
	}

});

app.post('/todos',function (req,res) {
	// var body = req.body; // underscore . pick
	var  body = _.pick(req.body,'description','completed');

			db.todo.create(body).then(function(todo) {
					res.json(todo.toJSON());
					console.log('in first promise');
			}).catch(function (e) {
				res.sendStatus(400).json(e);
			}); // used catch to handle rejection condition


	// /*if( !_.isString(body.description) || body.description.trim().length === 0){

	// 	/*console.log(body);*/
	// 	return res.sendStatus(400);
	// }

	// body.description = body.description.trim();
		
	// body.id = todoNext;
	// todoNext++; 
	// todos.push(body)
	// // console.log('description'+ body.description);
	// //console.log(body);
	// res.json(body);

})

app.delete('/delete/:id', function (req,res) {

		var todoId = parseInt( req.params.id, 10);
		var matchtodoId = _.findWhere( todos ,{id: todoId});

		if (!matchtodoId){ 
			res.sendStatus(404);
		} else {

			todos = _.without(todos,matchtodoId);
			res.json(matchtodoId);
		}

});


 app.put('/update/:id', function (req, res) {

 				//var updateId = parseInt(req.params.id, 10);
 		 var todoId = parseInt( req.params.id, 10);
 		 var matchtodoId = _.findWhere( todos ,{id: todoId});
 		 var body = _.pick( req.body,'description','completed');
 		 var attributes ={};


 		 if (!matchtodoId){ 
			res.sendStatus(404);
		}


 		 if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {

 		 		 attributes.completed = body.completed; 
 		 } else if (body.hasOwnProperty('completed')) {

 		 	return res.sendStatus(400);
 		 } 

 		 if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
 		 	 attributes.description = body.description;

 		 } else if (body.hasOwnProperty('description')) {

 		 	 return res.sendStatus(400);
 		 }

 		 _.extend(matchtodoId,attributes);
 		 res.json(matchtodoId);
});

 db.sequelize.sync().then( function() {
 			app.listen( PORT, function() {
			console.log('server listning port : ' + PORT);
	})

 })

