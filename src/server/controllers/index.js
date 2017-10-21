var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/MatchesDB';
const picasa = require('./picasa.js');
const request = require('request').defaults({encoding: null});

module.exports = (router) => {
  if (process.env.NODE_ENV !== 'production') {
  	router.get('/auth', (req, res) => {
  		console.log("auth");
  		res.redirect(picasa.authURL);
  	});
  	router.get('/getToken', (req, res) => {
  		console.log("Get Token");
  		if(!!req.query.code) {
  			picasa.getTokens(req.query.code, res);
  		} else {
  			res.status(500).send({ 'error': "Missing code" })
  		}
  	});   	
  	router.get('/getImages', (req, res) => {
  		console.log("Get FIFA Images");
  		picasa.getImages(res);
  	});
  	router.get('/getImageData', (req, res) => {
  		console.log("Download Image");
  		if(!!req.query.url) {
  			request(req.query.url).pipe(res);
  		} else {
  			res.status(500).send({ 'error': "Missing code" })
  		}
  	});	
  	router.get('/getDbData', (req, res) => {
  		console.log("Get All Data from DB");
  		let database = null;
		MongoClient.connect(url)
		  .then(function(db) {
		  	database = db;
		    var collection = db.collection('Matches');
		    return collection.find().toArray();
		  })
		  .then(function(items){
		  	console.log("sucessssss", items)
		  	res.status(200).send(items);
		  	database.close();
		  })
		  .catch(function (err) {
		  	console.log("ERRORRRRRRRR", err);
		  	res.status(500).send({ 'error': err })
		  	database.close();
		  })		
  	});
	router.get('/saveDbData', (req, res) => {
		console.log("Save Data to DB");
		let data = req.query.data;
		let database = null;
  		if(!!data) {
  			data = JSON.parse(decodeURIComponent(data));
  			MongoClient.connect(url)
  			  .then(function(db){
  			  	var collection = db.collection('Matches');
  			  	return collection.insertOne(data);
  			  })
  			  .then(function(resp){
  			  	console.log("sucessssss", resp);
  			  	res.status(200).send(resp);
  			  	database.close();
  			  })
			  .catch(function (err) {
			  	console.log("ERRORRRRRRRR", err);
			  	res.status(500).send({ 'error': err });
			  	database.close();
			  })  	
  		} else {
  			res.status(500).send({ 'error': "Missing Data" })
  		}		
	});  	  	  	  	
	router.get('*', (req, res) => {
		console.log("DEFAULT");
		res.render('index');
	});
  }
};
