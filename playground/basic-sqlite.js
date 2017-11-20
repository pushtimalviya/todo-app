var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{

		'dialect': 'sqlite',
		'storage': __dirname+'/basic-sqlite.sqlite'

}); 
var Todo = sequelize.define('todo', {
		description: {
			 type: Sequelize.STRING,
			 allowNull: false,
			 validate: {
			 	len: [1,250]
			 }
		},
		completed:{
			type:Sequelize.BOOLEAN,
			allowNull:false,
			defaultValue:false
	}
});

sequelize.sync({


 }).then(function (){

		console.log('everything is synced');

/* 	Todo.findById(1).then( function (todo) {


 				if (todo){
 					console.log(todo.toJSON());
 				}else {
 					console.log('not found')
 				}*/
 			Todo.findAll ({

 				where: {
 					// completed : false
 					description: {

 						$like: '%clean%'
 					}
 				}
 			}).then(function (todos) {

 				todos.forEach(function (todo){
					console.log(todo.toJSON());
 				});
 			})
 	 }); 

/*	force:true

	}).then(function () {
		console.log('everything is sync');

		Todo.create({ 
					description: 'take out trash'   
	
	}).then(function (todo) {
						return Todo.create({ 
						description:' clean office'

							});
	}).then (function () {
		console.log('3rd promise')
		//return Todo.findById(1)
			return Todo.findAll ( {

				where:{
					completed : false
				}
			});
	}).then( function(todos){
		if (todos) {

			todos.forEach ( function (todo) {
				console.log(todo.toJSON());
			})
		} else{
			console.log('no todo found')
		}
	}).catch( function (e) {
		console.log(e);
	});*/