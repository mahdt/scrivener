const Picasa = require('picasa');
const picasa = new Picasa();

const config = {
  clientId     : '619149155771-ak41tc5t799ijgmv4cvdn41ovefcnhg5.apps.googleusercontent.com',
  clientSecret : "CGQlJr2dxFseaywXXC3uKxGk",
  redirectURI  : 'http://localhost:8003/getToken'
}
//------------------------------------------------------------
/*add this line to get photos function in picasa node module*/
//accessTokenParams['imgmax'] = 'd';
//------------------------------------------------------------

const authURL = picasa.getAuthURL(config);

var accessTokenS = "";
var refreshTokenS = "";

const options = {albumId: '6470952834617128081'};

// picasa.getAlbums(accessToken, options,  (error, albums) => {
//   console.log(error, albums)
// })
// picasa.getPhotos(accessToken, options,  (error, albums) => {
//   console.log(error, albums)
// })
function getAllImages() {
	return new Promise((resolve, reject) => {
		if(refreshTokenS === "") {
			reject({ 'error': "Not connected to google api" });
		} else {
			picasa.getPhotos(accessTokenS, options,  (error, albums) => {
			  if(!!error) {
			  	reject({ 'error': error });
			  } else {
			  	resolve(albums);
			  }
			});
		}
	})
}

function getTokens(code, res) {
	picasa.getAccessToken(config, code, (error, accessToken, refreshToken) => {
	  if(!!error) {
	  	res.status(500).send({ 'error': error });
	  } else {
	  	accessTokenS = accessToken;
	  	refreshTokenS = refreshToken;
	  	res.status(200).send('Successfully connected to Google photos API');
	  }
	})	
}
function refreshToken(res){
	picasa.renewAccessToken(config, refreshTokenS, (error, accessToken) => {
	  accessTokenS = accessToken;
	})	
}
module.exports = {
	'authURL'     : authURL,
	'getTokens'   : getTokens,
	'getAllImages': getAllImages
};
