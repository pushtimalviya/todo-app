var express = require('express');

var app = express();
var PORT = process.env.PORT || 8080;

//   app.use( express.static(__dirName+''));
app.get('/',(function ( req,res) {

	res.send ('todo API root');
})
);

app.listen( PORT, function() {
	console.log('server listning port' + PORT);
})