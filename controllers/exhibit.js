var express = require('express')
var router = express.Router();
var bodyParser = require('body-parser');
var isvalid = require('isvalid');
var mysql = require('mysql');
var swaggerJSDoc = require('swagger-jsdoc');

var jsonParser = bodyParser.json()

/**
 * @swagger
 * definition:
 *   Exhibit:
 *    properties:
 *      id:
 *        type: integer
 *      exhibit_name:
 *        type: string
 *      active:
 *        type: integer
 *   ExhibitPost:
 *    properties:
 *      id:
 *        type: integer
 *      exhibit_name:
 *        type: string
 *      active:
 *        type: integer
 */


 /**
  * @swagger
  * /exhibit:
  *   get:
  *     description: Gets all Exhibit items
  *     summary: Get all Exhibit items
  *     tags:
  *       - Exhibit
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Successful
  *         schema:
  *           type: array
  *           items:
  *             $ref: '#/definitions/Exhibit'
  *       400:
  *         description: Bad Request
  */
router.get('/', function(req,res){
	var database = req.app.get('database'); // Database Global Connection
  var query = 'SELECT * FROM exhibit'; // SQL Query

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
 * /exhibit/{id}:
 *   get:
 *     summary: Gets an exhibit item
 *     description: Get an individual exhibit from the database
 *     tags:
 *       - Exhibit
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Exhibit ID
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successful
 *         schema:
 *           $ref: '#/definitions/Exhibit'
 *       400:
 *         description: Bad Request
 */
router.get('/:id', function(req,res){
  var database = req.app.get('database'); // Database Global Connection
  var exhibitId = req.params.id; // Path Parameter
  var query = 'SELECT * FROM exhibit WHERE id = ' + database.escape(exhibitId); // SQL Query with verified user input

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
 * /exhibit:
 *   post:
 *     description: Creates a new exhibit
 *     summary: Post an exhibit
 *     tags:
 *       - Exhibit
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: exhibit
 *         description: Exhibit Object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ExhibitPost'
 *     responses:
 *       201:
 *         description: Added news item
 *         schema:
 *           $ref: '#/definitions/Exhibit'
 *       400:
 *         description: Bad Request
 */
router.post('/', function(req,res){
				var data = req.body
        var exhibit_name = mysql.escape(data.exhibit_name); // Escapes all user inputted data
        var database = req.app.get('database'); // Database Global Connection
        var query =
          'INSERT INTO exhibit '+
          '(exhibit_name) VALUES ('+exhibit_name+')'; // SQL Query
				console.log(query)
        database.query(query, function(error, result){ // SQL Query Execution
          if( !error ) {
            console.log(result);
            res.status(201).send(result); // Status: OK. Return Query
          } else {
              console.error('Error: %s',error); // Log Error
              res.status(400).send("Bad Request."); // Status: Bad Request. Return Error String
          }
        });
});

/**
 * @swagger
 * /exhibit/{id}:
 *   delete:
 *    summary: Deletes an exhibit
 *    description: Delete an individual exhibit from the database
 *    tags:
 *      - Exhibit
 *    parameters:
 *      - name: id
 *        description: Exhibit ID
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
  var exhibitID = req.params.id; // Path Parameter
  var query = 'DELETE FROM exhibit WHERE id = ' + database.escape(exhibitID); // SQL Query with verified user input

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
 * /exhibit/{id}:
 *   put:
 *    summary: Updates an exhibit
 *    description: Update an individual exhibit from the database
 *    tags:
 *      - Exhibit
 *    parameters:
 *      - name: id
 *        description: Exhibit ID
 *        in: path
 *        required: true
 *        type: integer
 *      - name: news
 *        description: Exhibit Object. Everything Optional
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/ExhibitPost'
 *    responses:
 *     200:
 *      description: Successful
 *     400:
 *      description: Bad Request
 */
router.put('/:id', function(req,res){
		  var data = req.body
      var query = 'UPDATE exhibit SET ';
      var database = req.app.get('database') // Database Global Connection
      var exhibitID = mysql.escape(req.params.id); // Path Parameter - Escape user inputted values

			var idx = 0
			var count = Object.keys(data).length
			for (var key in data){ // Iterates through updated values
				var keyValid = (mysql.escape(key)).slice(1,-1); // Validates User Inputted Key
				var valueValid = mysql.escape(data[key]); // Valides User Inputted Value
				query = query + keyValid + "=" + valueValid // Build Query
				if(idx != count - 1){
					query = query + ", "; // Build Query
				}
				idx = idx + 1
			}

      query = query + ' WHERE id = ' + exhibitID; // SQL Query

      database.query(query, function(error, result){ // SQL Query Execution
        if (error) {
          console.error("Error: %s", error); // Log Error
          res.status(400).send("Bad Request."); // Status: Bad Request. Return Error String
        } else {
          console.log(result);
          res.status(200).send(result); // Status: OK. Return Query
        }
      });
});

module.exports = router;
