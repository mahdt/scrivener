import React from 'react';
import { connect } from 'react-redux';
import Fuse from 'fuse-js-latest'
import 'client/assets/styles/main.less';

import MatchFacts from './MatchFacts.js';
import Loader from '../components/Loader.js';

import t from 'client/assets/images/fifa18.jpg';

class MatchStats extends React.Component {
	constructor(props) {
		super(props);
		this.state = {imgLoaded: false, isDone:false, progress:'0', data:{Home:{}, Away:{}}, img:{},fields:['Goals', 'Shots', 'Shots On Target', 'Possession %','Tackles','Fouls', 'Yellow Cards', 'Red Cards', 'Injuries', 'Offsides', 'Corners', 'Shot Accuracy %', 'Pass Accuracy %']};
		this.handleChange  = this.handleChange.bind(this);
		this.handleFormChange  = this.handleFormChange.bind(this);
		this.filterImage   = this.filterImage.bind(this);
		this.runOCR        = this.runOCR.bind(this);
		this.processData   = this.processData.bind(this);
		this.getDataObject = this.getDataObject.bind(this);
		this.updateFields  = this.updateFields.bind(this);
		this.saveData      = this.saveData.bind(this);
		this.getImageData  = this.getImageData.bind(this);

		if(this.props.imgData.hasOwnProperty('content'))
			this.getImageData(this.props.imgData.content.src);		
	}

	componentWillReceiveProps(nextProps, nextState) {
		if(JSON.stringify(this.props.imgData) !== JSON.stringify(nextProps.imgData)) {
			if(nextProps.imgData.hasOwnProperty('content')){
				this.setState({isDone: false, progress:'0', imgLoaded:false, data:{Home:{}, Away:{}}});
				this.getImageData(nextProps.imgData.content.src);
			}
		}
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
					this.setState({'img': src, imgLoaded: true});
					this.filterImage(src);
				});				
			});		
		});
	}

	filterImage(myImage) {
		Jimp.read(myImage).then((image) => {
		    image//.greyscale()//.contrast(+1)//greyscale().contrast(+1)
		    //    .invert()
		        .greyscale()
		  //      .invert()
		        .contrast(+1)
		        .getBase64(Jimp.MIME_JPEG, (err, src) => {		        	
		        	this.setState({'img': src});
		        	this.runOCR(src);
		        })
		  //      .write("img-opt.jpg");
		})
	}	

	runOCR(myImage) {
    Tesseract.recognize(myImage, {lang: 'eng'})
    .then((result) => {
			console.log(result)
			console.log(result.text)
			this.processData(result);
		}).progress((result) => {
			let progress = Math.round(result["progress"] * 100);
			this.setState({progress: progress});
		console.log(result["status"] + " (" +(result["progress"] * 100) + "%)")
		});
	}

	processData(result) {
		var data = [];
		result.lines.forEach(({text, confidence}) => {
			if(confidence > 65)
				data.push({'text':text});
		})
		var dataObj = this.getDataObject(data);
		this.setState({data: dataObj});
		this.setState({isDone: true});
		console.log("Data", dataObj);
//		this.updateFields(dataObj);	
	}

	getDataObject(rawData) {
		var result = {"Home": {}, "Away":{}};
		var search = this.state.fields.map((display, index) => {
			let id = display.replace(/[^a-zA-Z ]/g, "");
			return id;
		});
		var numberPattern = /\d+/g;
		var options = {
			shouldSort: true,
			tokenize: true,
			includeScore: true,
		  keys: ['text'],
		  id: 'text'
		};
		var fuse = new Fuse(rawData, options);
		search.forEach((str) => {
			let key = str.replace(/[^a-zA-Z]/g, "");
			let r = fuse.search(str);
			if(!!r[0] && r[0].score < 0.5) {
				let t = r[0].item.match(numberPattern);
				if(t[0] !== undefined) {
					result.Home[key] = t[0];
				}
				if(t[1] !== undefined) {
					result.Away[key] = t[1];
				}
			} else {
				result.Home[key] = -1;
				result.Away[key] = -1;
			}
		});
		window.fuse = fuse;
		window.result = result;

		return result;
	}

	updateFields(data){
		var $this = this;
		let home = data.Home;
		let away = data.Away;
		let alert = " alert alert-danger"

		Object.keys(home).forEach((field)=>{
			let value = home[field]; 
			// let id    = field.replace(/[^a-zA-Z]/g, "");
			$this["home"+field].value = value;
			if(value == -1){
				$this["home"+field].className = $this["home"+field].className + alert;
			}
		})

		Object.keys(away).forEach((field)=>{
			let value = away[field]; 
			// let id    = field.replace(/[^a-zA-Z]/g, "");
			$this["away"+field].value = value;
			if(value == -1){
				$this["away"+field].className = $this["away"+field].className + alert;
			}			
		})		
	}

	handleChange(e, side, label){
		let value = e.target.value;
		let data = this.state.data;
		data[side][label] = value;
		this.setState({'data': data});
		console.log(data);
	}



	saveData(e) {
		var url = new URL("http://localhost:8003/saveDbData");
		var data = this.state.data;
		data._id = this.props.imgData.id;
		if(!data._id || !data.Home.Player || !data.Away.Player) {
			console.log("missing params")
			return
		}
		var params = {'data': data};
		Object.keys(params).forEach(key => url.searchParams.append(key, encodeURIComponent(JSON.stringify(params[key]))));//encodeURIComponent(JSON.stringify(params[key]))
		fetch(url).then(response => {
			if(!response.ok) {
				throw response;
			}
			return response.text();
		}).then( text => {
			console.log(text);
		}).catch(function(error){
			error.text().then( errorMessage => {
				console.log(errorMessage);
			});
		});	

	}

	validateData({Home={},Away={}}, fields) {
		let ids = fields.map((display, index) => {
			return display.replace(/[^a-zA-Z]/g, "");
		});

		if(!Home.hasOwnProperty('Player') || !Away.hasOwnProperty('Player'))
			return false;
		if(Home['Player'] === Away['Player'])
			return false;

		let inValid = ids.some((key)=>{
			if(Home.hasOwnProperty(key) && Away.hasOwnProperty(key)) {
				if(Home[key] == "" || Home[key] < 0
					 || Away[key] == "" || Away[key] < 0) {
					return true;
				}
			} else {
				return true
			}
		});

		return !inValid
	}

	handleFormChange(data) {
		this.setState(data);
	}

	render() {
		let fields = this.state.fields.map((display, index) => {
			let id = display.replace(/[^a-zA-Z]/g, "");
			return {id, display}
		});

		let stats;
		if(this.state.isDone) {
			stats = <MatchFacts handleChange={this.handleFormChange} data={this.state.data} fields={fields}/>
		} else {
			stats = <Loader type={"progress"} progress={this.state.progress}/>
		}

		let imgView;
		if(this.state.imgLoaded) {
			imgView = <img src={this.state.img} style={{width: '100%'}} className={"rounded float-left"} alt="..."/>
		} else {
			imgView = <Loader/>
		}

		return (
			<div className={"container"}>
				<div className={"row"}>
					<div className={"col col-sm-6 col-md-6 col-lg-4 col-xl-4 align-self-center"}>
						<div style={{display:this.state.imgLoaded? "block":"none"}}>
							<img src={this.state.img} style={{width: '100%'}} className={"rounded float-left"} alt="..."/>
						</div>
						<div style={{display:this.state.imgLoaded? "none":"block"}}>
							<Loader/>
						</div>
						{/*imgView*/}
					</div>
					<div className={"col align-self-center"}>
						{stats}
					</div>			
				</div>
				<div className={"d-flex align-items-center justify-content-center"} style={{paddingTop: "25px"}}>
					<button type="button" className={"btn btn-primary btn-lg btn-block"} onClick={this.saveData} disabled={!this.validateData(this.state.data, this.state.fields)}>Save</button>	
				</div>				
			</div>
			);
	}
}

export default MatchStats