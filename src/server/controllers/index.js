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
	router.get('*', (req, res) => {
		console.log("DEFAULT");
		res.render('index');
	});
  }
};
