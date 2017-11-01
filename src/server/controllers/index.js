const mongoDB = require('./mongoDB.js');
const picasa  = require('./picasa.js');
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
  		picasa.getAllImages()
  		  .then((resolved) => {
  		  	res.status(200).send(resolved);
  		  })
  		  .catch((rejected) => {
  		  	res.status(500).send(rejected);
  		  })
  	});
  	router.get('/getImageData', (req, res) => {
  		console.log("Download Image");
  		if(!!req.query.url) {
  			request(req.query.url).pipe(res);
  		} else {
  			res.status(500).send({ 'error': "Missing code" })
  		}
  	});	
  	router.get('/findDbData', (req, res) => {
  		console.log("Get All Data from DB");
  		let query      = req.query.query;
  		let projection = req.query.projection;
  		if(!!query && !!projection){
  			query = JSON.parse(decodeURIComponent(query));
  			projection = JSON.parse(decodeURIComponent(projection));
			mongoDB.findData(query, projection)
			  .then((resolved) => {
				console.log("sucessssss", resolved);
				res.status(200).send(resolved);
			  })
			  .catch((rejected) => {
			  	console.log("ERRORRRRRRRR", rejected);
			  	res.status(500).send(rejected);
			  });   				  			
  		} else {
  			res.status(500).send({ 'error': "Missing params" })
  		}
	
  	});  	
  	router.get('/getDbData', (req, res) => {
  		console.log("Get All Data from DB");
		mongoDB.getAllData()
		  .then((resolved) => {
			console.log("sucessssss", resolved);
			res.status(200).send(resolved);
		  })
		  .catch((rejected) => {
		  	console.log("ERRORRRRRRRR", rejected);
		  	res.status(500).send(rejected);
		  });  				
  	});
	router.get('/saveDbData', (req, res) => {
		console.log("Save Data to DB");
		let data = req.query.data;
		let database = null;
  		if(!!data) {
  			data = JSON.parse(decodeURIComponent(data));
  			mongoDB.saveData(data)
  			  .then((resolved) => {
  				console.log("sucessssss", resolved);
  				res.status(200).send(resolved);
  			  })
  			  .catch((rejected) => {
  			  	console.log("ERRORRRRRRRR", rejected);
  			  	res.status(500).send(rejected);
  			  });  	
  		} else {
  			res.status(500).send({ 'error': "Missing Data" })
  		}		
	});
	router.get('/getNewMatches', (req, res) => {
		console.log("Get New Matches");
		Promise.all([mongoDB.getAllData(), picasa.getAllImages()])
		  .then((resolved) => {
		  	let dbData = resolved[0];
				let google = resolved[1];
				let isPresent = {};
				dbData.forEach(({_id}) => {
					isPresent[_id] = true;
				});
				let newImages = google.filter(({id}) => {
					return !isPresent.hasOwnProperty(id);
				})
				res.status(200).send(newImages);
		  })
		  .catch((rejected) => {
		  	res.status(500).send({ 'error': rejected });
		  })
	});	  	  	  	  	
	router.get('*', (req, res) => {
		console.log("DEFAULT");
		res.render('index');
	});
  }
};
