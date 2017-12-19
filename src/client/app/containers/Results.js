import React from 'react';
import { VictoryChart, VictoryGroup, VictoryBar, VictoryAxis, VictoryLegend, VictoryLabel } from 'victory';

class Results extends React.Component {
	constructor(props) {
		super(props);
		this.getDBData     = this.getDBData.bind(this);
		this.findData      = this.findData.bind(this);
		this.analyseData   = this.analyseData.bind(this);
		this.state = {dbData:[], Talha:[], Mahd:[], Habib:[]};

		this.findData({$or: [{"Home.Player": "Habib"}, {"Away.Player": "Habib"}]},{}, "Habib");
		this.findData({$or: [{"Home.Player": "Talha"}, {"Away.Player": "Talha"}]},{}, "Talha");
		this.findData({$or: [{"Home.Player": "Mahd" }, {"Away.Player": "Mahd"}]},{}, "Mahd" );
	}

	findData(query, projection, field) {
		var url = new URL("http://localhost:8003/findDbData");
		var params = {'query': query, 'projection':projection};
		Object.keys(params).forEach(key => url.searchParams.append(key, encodeURIComponent(JSON.stringify(params[key]))));
		fetch(url).then(response => {
			if(!response.ok) {
				throw response;
			}
			return response.text();
		}).then( text => {
			var data = JSON.parse(text);
			this.setState({[field]: data});
		}).catch(function(error){
			error.text().then( errorMessage => {
				console.log(errorMessage);
			});
		});			
	}

	analyseData(data, user){
		let wins   = 0;
		let losses = 0;
		let draws = 0;
		let numberofMatches = 0;
		let goalsScored = 0;
		let goalsConceded = 0;

		data.forEach(({Home, Away}) => {
			if(Home.Player === user){
				goalsScored += parseInt(Home.Goals);
				goalsConceded += parseInt(Away.Goals);
				if(Home.Goals > Away.Goals) {
					wins++;
				} else if(Home.Goals == Away.Goals) {
					draws++;
				} else {
					losses++;
				}
			} else {
				goalsScored += parseInt(Away.Goals);
				goalsConceded += parseInt(Home.Goals);
				if(Away.Goals > Home.Goals) {
					wins++;
				} else if(Away.Goals == Home.Goals) {
					draws++;
				} else {
					losses++;
				}
			}
		});
		numberofMatches = data.length;
		return [{key: 'Won', value: wins},
						{key: 'Draw', value: draws},
						{key: 'Lost', value: losses},
						{key: 'Goals Scored', value: goalsScored},
						{key: 'Goals Conceded', value: goalsConceded},
						{key: 'Total Matches', value: numberofMatches}]
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
			debugger
			this.setState({dbData: imagesArray});
		}).catch(function(error){
			error.text().then( errorMessage => {
				console.log(errorMessage);
			});
		});	
	}

	render() {
		return (
			<div>
				<VictoryChart domainPadding={25} width={500}>
					<VictoryAxis
					    tickCount={20}
					    tickValues={["Won","Draw","Lost","Goals Scored","Goals Conceded","Total Matches"]}
					    tickFormat={(t) => {
					    	return t
					    }}
						  style={{
						    tickLabels: {fontSize: 6, padding: 5}
						  }}	    
					  />

					<VictoryLegend x={125} y={10}
					  orientation="horizontal"
					  colorScale={"qualitative"}
					  style={{title: {fontSize: 8 } }}
					  data={[
					    { name: "Habib"},
					    { name: "Talha"},
					    { name: "Mahd" }
					  ]}
					/>		

					<VictoryGroup offset={10}
					  colorScale={"qualitative"}
					>
					  <VictoryBar
					    labels={(d) => d.value }
					    style={{ labels: { fill: "white", fontSize: 6} }}
					    labelComponent={<VictoryLabel dy={30}/>}					  
					    data={this.analyseData(this.state.Habib, "Habib")}
					    x = {(d) => {      	
					    	return d.key;
					    }}
					    y = {(d) => {
					    	return d.value;
					    }}
					  />

					  <VictoryBar
					    labels={(d) => d.value }
					    style={{ labels: { fill: "white", fontSize: 6} }}
					    labelComponent={<VictoryLabel dy={30}/>}					  
					    data={this.analyseData(this.state.Talha, "Talha")}
					    x = {(d) => {      	
					    	return d.key;
					    }}
					    y = {(d) => {
					    	return d.value;
					    }}
					  />

					  <VictoryBar
					    labels={(d) => d.value }
					    style={{ labels: { fill: "white", fontSize: 6} }}
					    labelComponent={<VictoryLabel dy={30}/>}					  
					    data={this.analyseData(this.state.Mahd, "Mahd")}
					    x = {(d) => {      	
					    	return d.key;
					    }}
					    y = {(d) => {
					    	return d.value;
					    }}
					  />
					</VictoryGroup>	
				</VictoryChart>		
			</div>
			);
	}

}

export default Results