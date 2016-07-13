var express = require('express')
  , router = express.Router();

router.get('/', function(req,res){
  	var database = req.app.get('database');
  	var query = 'SELECT * FROM exhibit';
	database.query(query, function(err, rows, fields){
		if(!err){
			console.log(rows);
			res.status(200).send(rows);
		}
		else{
			console.log('Error');
			res.status(404).send(rows);
		}
	});
});

router.post('/add', function(req,res){
	var name = req.query.exhibit_name;
	if(name == null){
		console.log('Parameter not found');
		res.sendStatus(500);
	}
	else{	
		var database = req.app.get('database');
		var query =
			'INSERT INTO exhibit '+
			'(exhibit_name) VALUES (' +
			'\''+name+'\')';
		database.query(query, function(err, rows, fields){
			if(!err){
				console.log(rows);
				res.status(200).send(rows);
			}
			else{
				console.log('Error');
				res.status(404).send(rows);
			}
		});	
	}
	
});

router.post('/delete', function(req,res){
	var id = req.query.exhibit_id;
	if(id == null){
		console.log('Parameter not found');
		res.sendStatus(400);
	}
	else{	
		var database = req.app.get('database');
		var query =
			'DELETE FROM exhibit '+
			'WHERE id = '+id;
		database.query(query, function(err, rows, fields){
		if(!err){
			console.log(rows);
			res.status(200).send(rows);
		}
		else{
			console.log('Error');
			console.log(query);
			res.status(500).send(rows);
		}
	});
	}
	
});

module.exports = router;


