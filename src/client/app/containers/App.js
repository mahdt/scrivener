import React from 'react';
import { connect } from 'react-redux';
import 'client/assets/styles/main.less';
import Fuse from 'fuse-js-latest'
// import Jimp from 'jimp'
// import Tesseract from 'tesseract.js'
import t from 'client/assets/images/fifa18.jpg';//'client/assets/images/fifa-match-facts.jpg';
import c from 'client/assets/images/fifa-match-facts-contrast.jpg';
import bw from 'client/assets/images/fifa-match-facts-bw.jpg';
import s from 'client/assets/images/fifa-match-sat.jpg';

class Habib extends React.Component {
	constructor(props) {
		super(props);
		this.runOCR      = this.runOCR.bind(this);
		this.filterImage = this.filterImage.bind(this);
		this.state = {preImage: t, postImage: t, preResult: "", postResult: ""};
		this.runOCR(t, "pre");
		this.filterImage(t);

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
    Tesseract.recognize(myImage,{
    	lang: 'eng',
    	essedit_char_blacklist: 'H'
    })
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
		var options = {
		  keys: ['text'],
		  id: 'text'
		};
		var fuse = new Fuse(data, options);
//		fuse.search("shoot on Target")
		window.fuse = fuse;		
	}

	render() {
		return (
			<div>
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
