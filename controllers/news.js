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
 *   News:
 *    properties:
 *      id:
 *        type: integer
 *      title:
 *        type: string
 *      text:
 *        type: string
 *      image_link:
 *        type: string
 *   NewsPost:
 *    properties:
 *      id:
 *        type: integer
 *      title:
 *        type: string
 *      text:
 *        type: string
 *      image_link:
 *        type: string
 */


 /**
  * @swagger
  * /news:
  *   get:
  *     description: Gets all News items
  *     summary: Get all News items
  *     tags:
  *       - News
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Successful
  *         schema:
  *           type: array
  *           items:
  *             $ref: '#/definitions/News'
  *       400:
  *         description: Bad Request
  */
router.get('/', function(req,res){
	var database = req.app.get('database'); // Database Global Connection
  var query = 'SELECT * FROM news'; // SQL Query

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
 * /news/{id}:
 *   get:
 *     summary: Gets a news item
 *     description: Get an individual news item from the database
 *     tags:
 *       - News
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: News ID
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successful
 *         schema:
 *           $ref: '#/definitions/News'
 *       400:
 *         description: Bad Request
 */
router.get('/:id', function(req,res){
  var database = req.app.get('database'); // Database Global Connection
  var newsId = req.params.id; // Path Parameter
  var query = 'SELECT * FROM news WHERE id = ' + database.escape(newsId); // SQL Query with verified user input

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
 * /news:
 *   post:
 *     description: Creates a new news item
 *     summary: Post a News item
 *     tags:
 *       - News
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: news
 *         description: News Object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/NewsPost'
 *     responses:
 *       201:
 *         description: Added news item
 *         schema:
 *           $ref: '#/definitions/News'
 *       400:
 *         description: Bad Request
 */
router.post('/', function(req,res){
				console.log("In News/Post")
				var data = req.body

        var title = mysql.escape(data.title); // Escapes all user inputted data
        var text = mysql.escape(data.text);
        var image_link = mysql.escape(data.image_link);
        var database = req.app.get('database'); // Database Global Connection
        var query =
          'INSERT INTO news '+
          '(title, text, image_link) VALUES (' +
          ' '+title+', '+text+', '+image_link+')'; // SQL Query
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
 * /news/{id}:
 *   delete:
 *    summary: Deletes a news item
 *    description: Delete an individual news item from the database
 *    tags:
 *      - News
 *    parameters:
 *      - name: id
 *        description: News ID
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
  var newsID = req.params.id; // Path Parameter
  var query = 'DELETE FROM news WHERE id = ' + database.escape(newsID); // SQL Query with verified user input

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
 * /news/{id}:
 *   put:
 *    summary: Updates a news item
 *    description: Update an individual news item from the database
 *    tags:
 *      - News
 *    parameters:
 *      - name: id
 *        description: News ID
 *        in: path
 *        required: true
 *        type: integer
 *      - name: news
 *        description: News Object. Everything Optional
 *        in: body
 *        required: true
 *        schema:
 *          $ref: '#/definitions/NewsPost'
 *    responses:
 *     200:
 *      description: Successful
 *     400:
 *      description: Bad Request
 */
router.put('/:id', function(req,res){
			var data = req.body
      var query = 'UPDATE news SET ';
      var database = req.app.get('database') // Database Global Connection
      var newsId = req.params.id; // Path Parameter - Escape user inputted values

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
      query = query + ' WHERE id = ' + newsId; // SQL Query

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
