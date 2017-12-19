import React from 'react';
// import { Collapse } from 'react-bootstrap';

class StatsTable extends React.Component {
	render() {
		const data = this.props.data;
		var title = !!this.props.title ? <th colSpan="2">{this.props.title}</th> : [];
		var rows = this.props.order.map((key)=>{
			const rowData = data[key] || "NA"
			return (
  			<tr>
  				<th className={"col-8"}>{key}</th>
  				<td className={"col-4"}>{rowData}</td>
  			</tr>					
				);
		});

		return (
	  	<table className="table" style={{marginBottom: 0}}> 
			  <thead className={"table-header"}>
			    <tr>
			      {title}
			    </tr>
			  </thead>	  	 	
	  		<tbody>  		
	  			{rows}			  					  							  						  						  						  						  			
	  		</tbody>
	  	</table>	
			);
	}
}

class UserProfile extends React.Component {
	constructor(props){
		super(props);
		this.state = {collapsed: false}
		this.handleDisplayMore = this.handleDisplayMore.bind(this);
	}

	handleDisplayMore(e){
		this.setState({collapsed: !this.state.collapsed})
	}

	render() {
		return (
			<div className={"d-flex flex-column"}>
			  <div className={"d-flex justify-content-center p-2"}>
			  	<img src={this.props.pic} alt="..." className={"img-thumbnail profile-pic"}/>
			  </div>
			  <div className={"d-flex flex-column justify-content-center p-2"}>
			  	<StatsTable data={this.props.data.summary} order={["Played", "Won", "Lost", "Draw", "Points Per Game"]}/>
			  	<div className={`${this.state.collapsed?"show-table":"hide-table"}`}>
			  		<StatsTable title={"Attack"} data={this.props.data.attack} order={["Goals", "Goals Per Game", "Shots", "Shots On Target", "Shooting Accuracy"]}/>
			  	</div>
			  	<div className={`${this.state.collapsed?"show-table":"hide-table"}`}>
			  		<StatsTable title={"Defence"} data={this.props.data.defence} order={["Clean Sheets", "Goals Conceded", "Goals Conceded Per Match"]}/>
			  	</div>	
			  	<button type="button" onClick={this.handleDisplayMore} className={"btn btn-link btn-sm"}>{this.state.collapsed?"Less":"More"}</button>
{/*			  		<tbody className={`${this.state.collapsed?"show-table":"hide-table"}`}>
			  			<tr>
			  				<th>Points Per Game</th>
			  				<td>1</td>
			  			</tr>			  		
			  		</tbody>
	  	
			  		<tbody>
			  			<tr onClick={this.handleDisplayMore}>
			  				<td>{this.state.collapsed?"Less":"More"}</td>
			  			</tr>	
			  		</tbody>*/}  	
			  </div>
			</div>
			);
	}
}

/*
SUmmary
	-played
	-won
	-lost
	-draw
	-points per game

Attack
Goals 1,720
Goals Per Match 1.77
Shots 6,943
Shots On Target 2,495
Shooting Accuracy % 36%

Defence
Clean Sheets 385
Goals Conceded 927
Goals Conceded Per Match 0.95	

*/

export default UserProfile