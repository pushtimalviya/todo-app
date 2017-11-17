var express = require('express');

var app = express();
var PORT = process.env.PORT || 8080;
var todos = [];
var todoNext = 1;
var bodyParser = require('body-parser');
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

	var todoId = req.params.id; // or convert it into int parseInt
	var matchId;
	console.log(todoId);

	todos.forEach(function (todo) {

		console.log(todo);

		// var id1= todo.id; // to
		if(todoId == todo.id){ // ===

			console.log(todo);
			matchId = todo;
		}
	});

	if (matchId){ 

		res.send(matchId);
	}else {

		res.sendStatus('not found');
	}

});

app.post('/todos',function (req,res) {
	var body = req.body;

	body.id = todoNext;
	todoNext++; 
	todos.push(body)
	// console.log('description'+ body.description);

	res.json(body);
})

app.listen( PORT, function() {
	console.log('server listning port : ' + PORT);
})