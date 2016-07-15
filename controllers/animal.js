var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser');
var isvalid = require('isvalid');
var mysql = require('mysql');
var animalSchema = require('../models/animalSchema');
var animalSchemaEdit = require('../models/animalSchemaEdit');

// Ron Basumallik

/**
 * @swagger
 * definition:
 *   Animal:
 *    properties:
 *      id:
 *        type: integer
 *      animal_name:
 *        type: string
 *      info_text:
 *        type: string
 *      exhibit_id:
 *        type: integer
 *      picture_link:
 *        type: string
 *      audio_link:
 *        type: string
 *      active:
 *        type: integer
 *   AnimalPost:
 *    properties:
 *      animal_name:
 *        type: string
 *      info_text:
 *        type: string
 *      exhibit_id:
 *        type: integer
 *      picture_link:
 *        type: string
 *      audio_link:
 *        type: string
 *      active:
 *        type: integer
 *   All:
 *    properties:
 *      id:
 *        type: integer
 *      animal_name:
 *        type: string
 *      info_text:
 *        type: string
 *      exhibit_id:
 *        type: integer
 *      picture_link:
 *        type: string
 *      audio_link:
 *        type: string
 *      exhibit_name:
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
  *           type: array
  *           items:
  *             $ref: '#/definitions/Animal'
  *       400:
  *         description: Bad Request
  */
router.get('/', function(req,res){
	var database = req.app.get('database'); // Database Global Connection
  var query = 'SELECT * FROM animal'; // SQL Query 

	database.query(query, function(error, result){ // SQL Query Execution
		if( !error ){
			console.log(result);
			res.status(200).send(result); // Status: OK. Return Query
		}
		else{
			console.error("Error: %s", error); // Log Error
			res.status(400).send("Bad Request"); // Status: Bad Request. Return Error String
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
 *           type: array
 *           items:
 *             $ref: '#/definitions/All'
 *       400:
 *         description: Animals not found
 */
router.get('/all', function(req,res){
	var database = req.app.get('database'); // Database Global Connection
  var query =
      'SELECT animal.id, animal.name, animal.info_text, animal.picture_link, '+
      'animal.audio_link, animal.exhibit_id, exhibit.exhibit_name FROM animal '+
      'INNER JOIN exhibit on animal.exhibit_id = exhibit.id';
  // ^ SQL Query Returns all Exhibit information in addition to Animal information

	database.query(query, function(err, result){ // SQL Query Execution
		if( !err ){
			console.log(result);
			res.status(200).send(result); // Status: OK. Return Query
		}
		else{
			console.log("Error: %s", error); // Log Error 
			res.status(400).send("Bad Request"); // Status: Bad Request. Return Error String
		}
	});
});

/**
 * @swagger
 * /animal/{id}:
 *   get:
 *     summary: Gets an animal
 *     description: Get an individual animal from the database
 *     tags:
 *       - Animals
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Animal ID
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successful
 *         schema:
 *           $ref: '#/definitions/Animal'
 *       400:
 *         description: Bad Request
 */
router.get('/:id', function(req,res){
  var database = req.app.get('database'); // Database Global Connection
  var animalId = req.params.id; // Path Parameter 
  var query = 'SELECT * FROM animal WHERE id = ' + database.escape(animalId); // SQL Query with verified user input

  database.query(query, function(error, result){ // SQL Query Execution
    if ( !error ){
      console.log(result); 
      res.status(200).send(result); // Status: OK. Return Query
    } else {
      console.error("Error: %s", error); // Log Error
      res.status(400).send("Bad Request."); // Status: Bad Request. Return Error String
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
 *           $ref: '#/definitions/AnimalPost'
 *     responses:
 *       201:
 *         description: Added animal
 *         schema:
 *           $ref: '#/definitions/Animal'
 *       400:
 *         description: Bad Request
 */
router.post('/', function(req,res){
  isvalid(req.body, animalSchema, function(error, data){ // Validates input types and model
    if ( error ){
      console.error("Error: %s", error); // Erorr in validation
      res.status(400).send("Bad Request"); // Status: Bad Request. Return Error String
    } else {
        var name = mysql.escape(data.animal_name); // Escapes all user inputted data
        var info = mysql.escape(data.info_text);
        var exhibit_id = mysql.escape(data.exhibit_id);
        var picture_link = mysql.escape(data.picture_link);
        var audio_link = mysql.escape(data.audio_link);
        var database = req.app.get('database'); // Database Global Connection
        var query =
          'INSERT INTO animal '+
          '(name, info_text, exhibit_id, picture_link, audio_link) VALUES (' +
          ' \''+name+'\', \''+info+'\', '+exhibit_id+
          ', \''+picture_link+'\', \''+audio_link+'\')'; // SQL Query

        database.query(query, function(error, result){ // SQL Query Execution
          if( !err ) {
            console.log(result);
            res.status(201).send(result); // Status: OK. Return Query
          } else {
              console.error('Error: %s',error); // Log Error
              res.status(400).send("Bad Request."); // Status: Bad Request. Return Error String
          }
        });
    }
  });
});

/**
 * @swagger
 * /animal/{id}:
 *   delete:
 *    summary: Deletes an animal
 *    description: Delete an individual animal from the database
 *    tags:
 *      - Animals
 *    parameters:
 *      - name: id
 *        description: Animal ID
 *        in: path
 *        required: true
 *        type: integer
 *    responses:
 *     200:
 *      description: Successful
 *     400:
 *      description: Bad Request
 */
router.delete('/:id', function(req,res){
  var database = req.app.get('database'); // Database Global Connection
  var animalId = req.params.id; // Path Parameter 
  var query = 'DELETE FROM animal WHERE id = ' + database.escape(animalId); // SQL Query with verified user input

  database.query(query, function(error, result){ // SQL Query Execution
    if ( !error ){
      console.log(result); 
      res.status(200).send(result); // Status: OK. Return Query
    } else {
      console.error("Error: %s", error); // Log Error
      res.status(400).send("Bad Request."); // Status: Bad Request. Return Error String
    }
  });
});

/**
 * @swagger
 * /animal/{id}:
 *   put:
 *    summary: Updates an animal
 *    description: Update an individual animal from the database
 *    tags:
 *      - Animals
 *    parameters:
 *      - name: id
 *        description: Animal ID
 *        in: path
 *        required: true
 *        type: integer
 *      - name: animal
 *        description: Animal Object. Everything Optional
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/AnimalPost'
 *    responses:
 *     200:
 *      description: Successful
 *     400:
 *      description: Bad Request
 */
router.put('/:id', function(req,res){
  isvalid(req.body, animalSchemaEdit, function(error, data){ // Validates input types and model
    if ( error ){
      console.error("Error: %s", error); // Erorr in validation
      res.status(400).send("Bad Request"); // Status: Bad Request. Return Error String
    } else {
      var query = 'UPDATE animal SET ';
      var database = req.app.get('database') // Database Global Connection
      var animalId = mysql.escape(req.params.id); // Path Parameter - Escape user inputted values

      for (var key in data){ // Iterates through updated values
        var keyValid = (mysql.escape(key)).slice(1,-1); // Validates User Inputted Key
        var valueValid = mysql.escape(data[key]); // Valides User Inputted Value
        var query = query + keyValid + "=" + valueValid; // Build Query
      }

      query = query + ' WHERE id = ' + animalId; // SQL Query

      database.query(query, function(error, result){ // SQL Query Execution
        if (error) {
          console.error("Error: %s", error); // Log Error
          res.status(400).send("Bad Request."); // Status: Bad Request. Return Error String
        } else {
          console.log(result); 
          res.status(200).send(result); // Status: OK. Return Query  
        }
      });
    }
  });

});

module.exports = router;
