import React from 'react';
import { connect } from 'react-redux';
import 'client/assets/styles/main.less';
import Fuse from 'fuse-js-latest'
// import Jimp from 'jimp'
// import Tesseract from 'tesseract.js'
import t from 'client/assets/images/fifa18.jpg';

const durl = 'https://lh3.googleusercontent.com/-XNwgkqWC5B8/Wc1xUZhtyoI/AAAAAAAAHtc/DKQc5hL79Jko1m268KozzbF74ucKN5g_gCHMYBhgL/I/IMG_4274.JPG';

class Habib extends React.Component {
	constructor(props) {
		super(props);
		this.runOCR        = this.runOCR.bind(this);
		this.filterImage   = this.filterImage.bind(this);
		this.processData   = this.processData.bind(this);
		this.getDataObject = this.getDataObject.bind(this);
		this.getAllImages  = this.getAllImages.bind(this);
		this.getImageData  = this.getImageData.bind(this);
	
		this.getAllImages();
		// var url = new URL("http://localhost:8003/getImageData");
		// var params = {'url' : durl};
		// Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		// fetch(url).then(response => {
		// 	return response.blob();
		// }).then( myBlob => {
		// 	let img = URL.createObjectURL(myBlob);
		// 	this.setState({
		// 		['postImage']: img
		// 	});
		// 	this.runOCR(img, "pre");
		// 	this.filterImage(img);			
		// });
		this.state = {temp:[], preImage: "", postImage: "", preResult: "", postResult: ""};
		// this.runOCR(t, "pre");
		// this.filterImage(t);

	}

	getAllImages(){
		var url = new URL("http://localhost:8003/getImages");
		var params = {};//{'url' : durl};
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		fetch(url).then(response => {
			if(!response.ok) {
				throw response;
			}
			return response.text();
		}).then( text => {
			var imagesArray = JSON.parse(text);
			imagesArray.forEach(({content}) => {
				this.getImageData(content.src);
			});
		}).catch(function(error){
			error.text().then( errorMessage => {
				console.log(errorMessage);
			});
		});		
	}

	getImageData(src) {
		var url = new URL("http://localhost:8003/getImageData");
		var params = {'url' : src};
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		fetch(url).then(response => {
			return response.blob();
		}).then( myBlob => {
			let img = URL.createObjectURL(myBlob);
			Jimp.read(img).then((image) => {
				image.getBase64(Jimp.MIME_JPEG, (err, src) => {
					var n = this.state.temp;
					n.push(src);
					this.setState({'temp': n});
				});				
			});		
		});
	}

	filterImage(myImage) {
		var $this = this;
		Jimp.read(myImage).then(function (image) {
		    image.greyscale()
		        .contrast(+1)
		        .getBase64(Jimp.MIME_JPEG, function (err, src) {
							$this.setState({
								['postImage']: src
							});		        	
		        	$this.runOCR(src, "post");
		        })
		  //      .write("img-opt.jpg");
		})
	}

	runOCR(myImage, type) {
		var dataName = type+"Result";
		var $this = this;
    Tesseract.recognize(myImage)
		.then(function(result) {
			console.log(result)
			console.log(result.text)
			$this.setState({
				[dataName]: result.text
			});
			$this.processData(result);
		}).progress(function(result) {
		console.log(result["status"] + " (" +(result["progress"] * 100) + "%)")
		});
	}

	processData(result) {
		var data = [];
		result.lines.forEach(({text, confidence}) => {
			if(confidence > 65)
				data.push({'text':text});
		})
		this.getDataObject(data)	
	}

	getDataObject(rawData) {
		var result = {"Home": {}, "Away":{}};
		var search = ["Goals", "Shots", "Shots on Target", "Possession", "Tackles", "Fouls", "Yellow Cards", "Red Cards", "Injuries", "Offsides", "Corners", "Shot Acuaracy", "Pass Acuaracy"];
		var numberPattern = /\d+/g;
		var options = {
		  keys: ['text'],
		  id: 'text'
		};
		var fuse = new Fuse(rawData, options);
		search.forEach((str) => {
			let r = fuse.search(str);
			let t = r[0].match(numberPattern);
			result.Home[str] = t[0];
			result.Away[str] = t[1];
		});
		window.fuse = fuse;
		window.result = result;

		return result;
	}

	render() {
		var r = this.state.temp.map((imgSrc, index) => {
			return (<img key={"H"+index} src={imgSrc}></img>)
		});
		return (
			<div>
				<div>{r}</div>
				<div>
				  PRE
					<img src={this.state.preImage}></img>
					{this.state.preResult}
				</div>
				<div>
				  POST
					<img src={this.state.postImage}></img>
					{this.state.postResult}
				</div>				
			</div>
			);
	}
}
const App = ({ children }) => <div>Hello World<Habib/></div>;

App.propTypes = {
  children: React.PropTypes.node
};

App.defaultProps = {
  children: undefined
};

export const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(App);
