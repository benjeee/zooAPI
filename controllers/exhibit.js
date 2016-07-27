var express = require('express')
  , router = express.Router();
var bodyParser = require('body-parser');
/**
 * @swagger
 * definition:
 *   Exhibit:
 *    properties:
 *      exhibit_name:
 *        type: string
 */

//Testing Commit

 /**
  * @swagger
  * /exhibit:
  *   get:
  *     description: Gets all Exhibits
  *     summary: Get all Exhibits
  *     tags:
  *       - Exhibits
  *     produces:
  *       - application/json
  *     responses:
  *       200:
  *         description: Successful
  *         schema:
  *           $ref: '#/definitions/Exhibit'
  *       404:
  *         description: Exhibits not found
  */
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

/**
 * @swagger
 * /exhibit:
 *   post:
 *     description: Creates a new exhibit
 *     summary: Post an Exhibit
 *     tags:
 *       - Exhibits
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: exhibit
 *         description: Exhibit Object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Exhibit'
 *     responses:
 *       201:
 *         description: Added exhibit
 *         schema:
 *           $ref: '#/definitions/Exhibit'
 *       500:
 *         description: Server Error
 */
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

/**
 * @swagger
 * /exhibit/{id}:
 *   delete:
 *    description: Deletes a single exhibit
 *    summary: Delete an Exhibit given ID
 *    tags:
 *      - Exhibits
 *    parameters:
 *      - name: id
 *        description: Exhibit ID
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *     200:
 *      description: Successfully deleted
 *     500:
 *      description: Server Error
 */
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
