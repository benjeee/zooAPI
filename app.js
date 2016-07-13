var express = require('express');
var mysql = require('mysql');
var app = express();

app.use('/animal', require('./controllers/animal'));
app.use('/exhibit', require('./controllers/exhibit'));

var connected = false;
var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: 'drummerdawg',
    database: 'SalisburyZoo'
});

connection.connect(function(err) {
    if(err != null) console.log('NOT CONECTDD');
    else {
    	app.set('database', connection);
    }
});

app.listen(3000, function (){
	console.log('App listening on 3000');
});

