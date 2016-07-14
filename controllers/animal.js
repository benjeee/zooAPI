var express = require('express')
  , router = express.Router();
var bodyParser = require('body-parser');
/**
 * @swagger
 * definition:
 *   Animal:
 *    properties:
 *      animal_name:
 *        type: string
 *      info_text:
 *        type: string
 *      exhibit_id:
 *        type: string
 *      picture_link:
 *        type: string
 *      audio_link:
 *        type: string
 */

 /**
  * @swagger
  * /animal:
  *   get:
  *     description: Gets all Animals
  *     summary: Get all Animals
  *     tags:
  *       - Animals
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Successful
  *         schema:
  *           $ref: '#/definitions/Animal'
  *       404:
  *         description: Animals not found
  */
router.get('/', function(req,res){
	var database = req.app.get('database');
  var query = 'SELECT * FROM animal';

	database.query(query, function(err, rows, fields){
		if( !err ){
			console.log(rows);
			res.status(200).send(rows);
		}
		else{
			console.error('Error');
			res.status(404).send("Animals not found");
		}
	});
});

/**
 * @swagger
 * /animal/all:
 *   get:
 *     description: Gets all Animals + Exhibits
 *     summary: Get all Animals + Exhibits
 *     tags:
 *       - Animals
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful
 *         schema:
 *           $ref: '#/definitions/Animal'
 *       404:
 *         description: Animals not found
 */
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

/**
 * @swagger
 * /animal:
 *   post:
 *     description: Creates a new animal
 *     summary: Post an Animal
 *     tags:
 *       - Animals
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: animal
 *         description: Animal Object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Animal'
 *     responses:
 *       201:
 *         description: Added animal
 *         schema:
 *           $ref: '#/definitions/Animal'
 *       500:
 *         description: Server Error
 */
router.post('/', function(req,res){
	var name = req.body.animal_name;
	var info = req.body.info_text;
	var exhibit_id = req.body.exhibit_id;
	var picture_link = req.body.picture_link;
	var audio_link = req.body.audio_link;
	var database = req.app.get('database');
	var query =
		'INSERT INTO animal '+
		'(name, info_text, exhibit_id, picture_link, audio_link) VALUES (' +
		' \''+name+'\', \''+info+'\', '+exhibit_id+
		', \''+picture_link+'\', \''+audio_link+'\')';
  var animal = {
    "animal_name": name,
    "info_text": info,
    "exhibit_id": exhibit_id,
    "picture_link": picture_link,
    "audio_link": audio_link
  }
  console.log(query);
	database.query(query, function(err, rows, fields){
    if( !err ){
  		console.log(rows);
  		res.status(201).send(rows);
  	}
  	else{
  		console.error('Error: Could not insert');
  		res.sendStatus(500);
  	}
  });
});

/**
 * @swagger
 * /animal/{id}:
 *   delete:
 *    description: Deletes a single animal
 *    summary: Delete an Animal
 *    tags:
 *      - Animals
 *    parameters:
 *      - name: id
 *        description: Animal ID
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *     200:
 *      description: Successfully deleted
 *     500:
 *      description: Server Error
 */
router.delete('/:id', function(req,res){
	var id = req.path.id;
	var database = req.app.get('database');
	var query = 'DELETE FROM animal WHERE id = '+id;

  database.query(query, function(err, rows, fields){
  	if(!err){
  		console.log(rows);
  		res.sendStatus(200);
  	} else {
  		console.log('Error');
  		console.log(query);
  		res.sendStatus(500);
  	}
  });
});

module.exports = router;
