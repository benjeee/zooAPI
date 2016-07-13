var express = require('express')
  , router = express.Router();


router.get('/', function(req,res){
	var database = req.app.get('database');
  	var query = 'SELECT * FROM animal';
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

router.get('/all', function(req,res){
	var database = req.app.get('database');
  	var query =
      'SELECT animal.id, animal.name, animal.info_text, animal.picture_link, '+
      'animal.audio_link, animal.exhibit_id, exhibit.exhibit_name FROM animal '+
      'INNER JOIN exhibit on animal.exhibit_id = exhibit.id';
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
	var name = req.query.animal_name;
	var info = req.query.info_text;
	var exhibit_id = req.query.exhibit_id;
	var picture_link = req.query.picture_link;
	var audio_link = req.query.audio_link;
	if(name == null || info == null || exhibit_id == null
			|| picture_link == null ||audio_link==null){
		console.log('Parameter not found');
		res.sendStatus(400);
	}
	else{
		var database = req.app.get('database');
		var query =
			'INSERT INTO animal '+
			'(name, info_text, exhibit_id, picture_link, audio_link) VALUES (' +
			' \''+name+'\', \''+info+'\', '+exhibit_id+
			', \''+picture_link+'\', \''+audio_link+'\')';
		database.query(query, function(err, rows, fields){
		if(!err){
			console.log(rows);
			res.status(200).send(rows);
		}
		else{
			console.log('Error');
			res.status(500).send(rows);
		}
	});
	}

});

router.post('/delete', function(req,res){
	var id = req.query.animal_id;
	if(id == null){
		console.log('Parameter not found');
		res.sendStatus(400);
	}
	else{
		var database = req.app.get('database');
		var query =
			'DELETE FROM animal '+
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
