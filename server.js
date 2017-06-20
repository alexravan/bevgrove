var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var app = express();
var fs = require("fs");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/test';

var mongoUri = 'mongodb://alex:EhPXuX34CvSsJT48@ds035623.mlab.com:35623/heroku_vphjj155'
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});




app.get('/', function(request, response) {

	response.set('Content-Type', 'text/html');
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	// var indexPage = '';
	// indexPage += "<!DOCTYPE HTML><html><head><title>f</title></head><body><h1>Welcome to TBD</h1>";				
	// indexPage += "</body></html>"
					// response.send(indexPage);
	response.sendfile('public/index2.html');
});


app.get('/about', function(request, response) {

	response.set('Content-Type', 'text/html');
	// response.header("Access-Control-Allow-Origin", "*");
	// response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	// var indexPage = '';
	// indexPage += "<!DOCTYPE HTML><html><head><title>f</title></head><body><h1>Welcome to TBD</h1>";				
	// indexPage += "</body></html>"
					// response.send(indexPage);
	response.sendfile('public/about.html');
});

app.get('/locations', function(request, response) {

	response.header("Access-Control-Allow-Origin", "*");
  	response.header("Access-Control-Allow-Headers", "X-Requested-With");

	db.collection('locs', function(error1, coll) {
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


 app.post('/addBusiness', function(request, response) {

	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	var business = String(request.body.business);
	var cat = String(request.body.cat);
	var img1 = String(request.body.img1);
	var img2 = String(request.body.img2);
	var img3 = String(request.body.img3);
	var placeid = String(request.body.PlaceID);
	var toInsert = 
			{  "business" 	: business,
			   "cat"		: cat,
			   "img1" 		: img1,
			   "img2" 		: img2,
			   "img3" 		: img3,
			   "PlaceID"	: placeid    
			};
		// {"error" : "Whoops, something is wrong with your data!"}
	if (business && cat && placeid) {

		db.collection('locs', function(error1, coll) {

			coll.upsert( { business : business } , toInsert,  { upsert: true }, function(updateErr, updated) {

				if (updateErr) {
					response.send(500);
				}
				else {
					
						coll.find().toArray(function(err, info) {
				 		if(!err)
							response.send(info);
				}); }
		    });
		});

	}
	else {
		response.status(500);
	}
});


app.get('/addBusiness', function(request, res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
                // 'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
});


app.use(express.static('public'));

app.listen(process.env.PORT || 3000);