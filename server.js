var express = require('express');
var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNext = 1;
var bodyParser = require('body-parser');
var _ = require('underscore')
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
	res.send(todos);
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



	if( !_.isString(body.description) || body.description.trim().length === 0){

		/*console.log(body);*/
		return res.sendStatus(400);
	}

	body.description = body.description.trim();
		
	body.id = todoNext;
	todoNext++; 
	todos.push(body)
	// console.log('description'+ body.description);
	//console.log(body);
	res.json(body);

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

})
app.listen( PORT, function() {
	console.log('server listning port : ' + PORT);
})