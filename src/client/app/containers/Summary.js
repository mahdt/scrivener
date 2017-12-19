import React from 'react';
import UserProfile from '../components/UserProfile.js';

class Summary extends React.Component {
	constructor(props) {
		super(props)
		this.state = {Talha:{summary:{}, attack:{}, defence:{}}, Mahd:{summary:{}, attack:{}, defence:{}}, Habib:{summary:{}, attack:{}, defence:{}}};
		this.getUserData = this.getUserData.bind(this);

		this.getUserData().then(({Habib, Talha, Mahd})=>{
			this.setState({Habib, Talha, Mahd});
		}).catch((error)=>{
			console.log(error);
		})
	}

	async getUserData() {
		const hData = await this.findData({$or: [{"Home.Player": "Habib"}, {"Away.Player": "Habib"}]},{});
	  const tData = await this.findData({$or: [{"Home.Player": "Talha"}, {"Away.Player": "Talha"}]},{});
		const mData  = await this.findData({$or: [{"Home.Player": "Mahd" }, {"Away.Player": "Mahd"}]},{});
		
		const Habib = this.analyseData(hData, 'Habib');
		const Talha = this.analyseData(tData, 'Talha');
		const Mahd = this.analyseData(mData, 'Mahd');

		return ({Habib, Talha, Mahd});
	}

	analyseData(data, user) {
		let wins   = 0;
		let losses = 0;
		let draws = 0;
		let numberofMatches = 0;
		let goalsScored = 0;
		let goalsConceded = 0;

		let pointPerGame = 0;//
		let shots = 0;//
		let shotsOnTarget = 0;//
		let shootingAccuracy = 0;
		let goalsPerMatch = 0;//
		let cleanSheets = 0;//
		let goalsConcededPerMatch = 0;//



		data.forEach(({Home, Away}) => {
			if(Home.Player === user){
				goalsScored += parseInt(Home.Goals);
				goalsConceded += parseInt(Away.Goals);
				shots += parseInt(Home.Shots);
				shotsOnTarget += parseInt(Home.ShotsOnTarget);
				if(parseInt(Away.Goals) == 0)
					cleanSheets += 1;

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
				shots += parseInt(Away.Shots);
				shotsOnTarget += parseInt(Away.ShotsOnTarget);	
				if(parseInt(Home.Goals) == 0)
					cleanSheets += 1;			

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
		pointPerGame = ((wins*3 + draws)/numberofMatches).toFixed(2);	
		goalsPerMatch = (goalsScored/numberofMatches).toFixed(2);
		goalsConcededPerMatch = (goalsConceded/numberofMatches).toFixed(2);
		shootingAccuracy = ((shotsOnTarget/shots)*100).toFixed(2) + '%';
		return ({
			summary : {
				'Played'					: numberofMatches,
				'Won'							: wins,
				'Lost'						: losses,
				'Draw'					 	: draws,
				'Points Per Game'	: pointPerGame
			},
			attack 	: {
				'Goals'							: goalsScored,
				'Goals Per Game'		: goalsPerMatch,
				'Shots'							: shots,
				'Shots On Target'		: shotsOnTarget,
				'Shooting Accuracy'	: shootingAccuracy
			},
			defence : {
				'Clean Sheets' 		: cleanSheets,
				'Goals Conceded' 	: goalsConceded,
				'Goals Conceded Per Match' : goalsConcededPerMatch
			}
		});
	}

	async findData(query, projection) {
		var url = new URL("http://localhost:8003/findDbData");
		var params = {'query': query, 'projection':projection};
		Object.keys(params).forEach(key => url.searchParams.append(key, encodeURIComponent(JSON.stringify(params[key]))));
		
		const data = await fetch(url);
		const asText = await data.text();
		return JSON.parse(asText);
	}

	render() {
		return (
			<div className={"row"}>
			  <div className={"col"}><UserProfile pic={"https://scontent.fewr1-4.fna.fbcdn.net/v/t31.0-8/11059669_10155508716880527_2346646431335235811_o.jpg?oh=af3f994dbbdb78e25751567fd32fe6b4&oe=5A91835F"} data={this.state.Talha}/></div>
			  <div className={"col"}><UserProfile pic={"https://scontent.fewr1-4.fna.fbcdn.net/v/t31.0-8/1507395_10203012863935396_9075127069013641751_o.jpg?oh=d3d8816473de2eb229f0ce608c4464ef&oe=5A95EF7B"} data={this.state.Habib}/></div>
			  <div className={"col"}><UserProfile pic={"https://scontent.fewr1-4.fna.fbcdn.net/v/t31.0-8/1263785_10152728599910129_6537429178935256931_o.jpg?oh=8980fc024fdf415adc38d4d0996f67b3&oe=5A8C6D70"} data={this.state.Mahd}/></div>
			</div>			
			);
	}
}

export default Summary