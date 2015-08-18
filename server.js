var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';

// var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://bevgrove:dv1000@ds035623.mongolab.com:35623/heroku_vphjj155';

var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});



app.get('/', function(request, response) {

	response.set('Content-Type', 'text/html');
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	var indexPage = '';
	indexPage += "<!DOCTYPE HTML><html><head><title>TBddD</title></head><body><h1>Welcome to TBD</h1>";				
	indexPage += "</body></html>"
					response.send(indexPage);
	
});

app.get('/locations', function(request, response) {

	response.header("Access-Control-Allow-Origin", "*");
  	response.header("Access-Control-Allow-Headers", "X-Requested-With");

	db.collection('locations', function(error1, coll) {
		if(error1){
			console.log('Error: database collection not found');
			response.send(500);
		}
		
		var id = coll.find({}).toArray(function (error2, cursor) {
			if (error2) {
				console.log("Find faile :(");
				response.send(500);
			} else {
				console.log("Find succeeded!");
				console.log(cursor);
				response.send(cursor);
			}
		});
	});
});

app.use(express.static('public'));

app.listen(process.env.PORT || 3000);