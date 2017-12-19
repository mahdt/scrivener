import React from 'react';
import MatchStats from './MatchStats.js';
import Pagination from './Pagination.js';
import Fuse from 'fuse-js-latest'

const durl = 'https://lh3.googleusercontent.com/-XNwgkqWC5B8/Wc1xUZhtyoI/AAAAAAAAHtc/DKQc5hL79Jko1m268KozzbF74ucKN5g_gCHMYBhgL/I/IMG_4274.JPG';

class NewMatches extends React.Component {
	constructor(props) {
		super(props);
		this.getAllImages  = this.getAllImages.bind(this);
		this.getDBData     = this.getDBData.bind(this);
		this.handleTabChange = this.handleTabChange.bind(this);
	
		this.state = {googleImages:[], dbData:[], newData:[], activeData:{}};
		
		const db = this.getDBData();
		const google = this.getAllImages();
		Promise.all([db, google]).then(values => { 
			this.setState({dbData: values[0]});
			this.setState({googleImages: values[1]});
			this.getNewData();
		}).catch(reason => {
		  console.log(reason)
		});		
	}

	getAllImages(){
		var promise = new Promise((resolve, reject) => {
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
				resolve(imagesArray);
				// this.setState({googleImages: imagesArray});
				// this.getNewData();
			}).catch(function(error){
				error.text().then( errorMessage => {
					reject(new Error(errorMessage));
				});
			});	
		});
		return promise;	
	}

	getDBData(){
		var promise = new Promise((resolve, reject)=>{
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
				resolve(imagesArray);
				// this.setState({dbData: imagesArray});
				// this.getAllImages();
			}).catch(function(error){
				error.text().then( errorMessage => {
					reject(new Error(errorMessage));
				});
			});	
		});
		return promise;
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
		this.setState({activeData: newImages[0]});
		return newImages;
	}

	handleTabChange(id) {
		const data = this.state.newData;
		this.setState({activeData: data[id -1]});
	}

	render() {
		var t = [];
		var tabs = this.state.newData.map((data, index) => {
			return index+1;
		});
		// if(r.length != 0){
		// 	t.push(<MatchStats imgData={this.state.newData[1]}/>)
		// } 
		return (
			<div>
				<Pagination handleChange={this.handleTabChange} data={tabs}/>
				{t}
				{<MatchStats imgData={this.state.activeData}/>}		
			</div>
			);
	}
}

export default NewMatches