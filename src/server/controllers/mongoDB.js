var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/MatchesDB';

function saveData(dataObj) {
	return new Promise((resolve, reject) => {
		let database = null;
		MongoClient.connect(url)
		  .then(function(db){
		  	var collection = db.collection('Matches');
		  	return collection.insertOne(dataObj);
		  })
		  .then(function(resp){
		  	resolve(resp);
		  	database.close();
		  })
		  .catch(function (err) {
		  	reject({ 'error': err });
		  	database.close();
		  })		
	});
}

function getAllData() {
	return new Promise((resolve, reject) => {
		let database = null;
		MongoClient.connect(url)
		  .then(function(db) {
		  	database = db;
		    var collection = db.collection('Matches');
		    return collection.find().toArray();
		  })
		  .then(function(items){
		  	resolve(items);
		  	database.close();
		  })
		  .catch(function (err) {
		  	reject({ 'error': err });
		  	database.close();
		  })		
	});
}

function findData(query, projection) {
	return new Promise((resolve, reject) => {
		let database = null;
		MongoClient.connect(url)
		  .then(function(db) {
		  	database = db;
		    var collection = db.collection('Matches');
		    if(Object.keys(projection).length !== 0) {
		    	// projection = JSON.parse(decodeURIComponent(projection));
		    	return collection.find(query, projection).toArray();
		    } else {
		    	return collection.find(query).toArray();
		    }
		  })
		  .then(function(items){
		  	resolve(items);
		  	database.close();
		  })
		  .catch(function (err) {
		  	reject({ 'error': err });
		  	database.close();
		  })		
	})
}

module.exports = {
	'saveData'   : saveData,
	'getAllData' : getAllData,
	'findData'	 : findData
};