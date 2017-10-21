import React from 'react';
import MatchStats from './MatchStats.js';

const durl = 'https://lh3.googleusercontent.com/-XNwgkqWC5B8/Wc1xUZhtyoI/AAAAAAAAHtc/DKQc5hL79Jko1m268KozzbF74ucKN5g_gCHMYBhgL/I/IMG_4274.JPG';

class NewMatches extends React.Component {
	constructor(props) {
		super(props);
		this.getAllImages  = this.getAllImages.bind(this);
		this.getDBData     = this.getDBData.bind(this);
	
		this.state = {googleImages:[], dbData:[], newData:[]};
		this.getDBData();
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
			this.setState({googleImages: imagesArray});
			this.getNewData();
		}).catch(function(error){
			error.text().then( errorMessage => {
				console.log(errorMessage);
			});
		});		
	}

	getDBData(){
		var url = new URL("http://localhost:8003/getDbData");
		var params = {};//{'url' : durl};
		Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
		fetch(url).then(response => {
			if(!response.ok) {
				throw response;
			}
			return response.text();
		}).then( text => {
			var imagesArray = JSON.parse(text);
			this.setState({dbData: imagesArray});
			this.getAllImages();
		}).catch(function(error){
			error.text().then( errorMessage => {
				console.log(errorMessage);
			});
		});	
	}

	getNewData(){
		var google = this.state.googleImages;
		var dbData = this.state.dbData;
		var options = {
		  threshold: 0,
		  distance: 0,			
		  keys: ['_id'],
		  id: '_id'
		};
		var fuse = new Fuse(dbData, options);		
		var newImages = google.filter(({id}) => {
			let result = fuse.search(id);
			return result.length == 0
		});
		this.setState({newData: newImages});
		return newImages;
	}

	render() {
		var r = this.state.newData.map((data, index) => {
			return (
				<div key={"H"+index}>
					<MatchStats imgData={data}/>
				</div>)
		});
var test = {"id":"6478332632290589314","album_id":"6470952834617128081","access":"only_you","width":"2448","height":"3264","size":"1877556","checksum":"","timestamp":"1508289586000","image_version":"8288","commenting_enabled":"true","comment_count":0,"content":{"type":"image/jpeg","src":"https://lh3.googleusercontent.com/-HZwcXhMF7rs/WeepNJSAeoI/AAAAAAAAIGA/K7l69ukqfgsO3GU7i7313ePkK-4XAR9rgCHMYBhgL/I/IMG_4329.JPG"},"title":"IMG_4329.JPG","summary":""}
//r[3], r[4](imp), 
		return (
			<div>
				{<MatchStats imgData={test}/>}
				{/*r*/}			
			</div>
			);
	}
}

export default NewMatches