var express = require('express');
var mysql = require('mysql');
var app = express();
var swaggerJSDoc = require('swagger-jsdoc');
var path = require('path');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/animal', require('./controllers/animal'));
app.use('/exhibit', require('./controllers/exhibit'));

var swaggerDefinition = {
  info: {
    title: 'Salisbury Zoo API',
    version: '1.0.0',
    description: 'RESTful API for the Salisbury Zoological Foundation'
  },
  host: '192.168.1.9:3000',
  basePath: '/',
};

var options = {
  swaggerDefinition: swaggerDefinition,
  apis: ['./controllers/*.js'],
};

var swaggerSpec = swaggerJSDoc(options);

app.use(express.static(path.join(__dirname,'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/swagger.json', function(req,res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
})

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
