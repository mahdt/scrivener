import React from 'react';

class MatchFacts extends React.Component {
	constructor(props){
		super(props);
		this.state = {data: props.data};

		this.handleChange = this.handleChange.bind(this);
	}

	componentWillReceiveProps(nextProps, nextState) {
		if(JSON.stringify(this.state.data) !== JSON.stringify(nextProps.data)) {
			this.setState({data: nextProps.data});
		}
	}

	handleChange(event, side) {
		const data = this.state.data;
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if(!data.hasOwnProperty(side)) {
			data[side] = {};
		}
		data[side][name] = value;
		this.props.handleChange(data);
		
		this.forceUpdate();
	}

	isValid(data, ...path) {
		for (var i = 0; i < path.length; i++) {
			if (!data || !data.hasOwnProperty(path[i])) {
				return "";
			}
			data = data[path[i]];
		}
		return data;
	}

	render() {
		var fields = this.props.fields.map(({id, display}, index) => {
			let homeData = this.isValid(this.state.data, "Home", id);
			let awayData = this.isValid(this.state.data, "Away", id);
			let warning = (homeData < 0 || awayData < 0) ? "has-danger" : ((homeData === "" || awayData === "") ? "has-warning" : "");
			return (
				<div className={`input-group row row-m-t ${warning}`} style={{height: "29px"}}>
				    <input type="text" className={`form-control ${homeData < 0 ? "form-control-danger": (homeData === "" ? "form-control-warning": "")} form-control-sm text-center`} type="number" onChange={(e)=>this.handleChange(e,"Home")} value={homeData} name={id} placeholder="Home"/>
				    <span className={"input-group-addon"}>{display}</span>
				    <input type="text" className={`form-control ${awayData < 0 ? "form-control-danger": (awayData === "" ? "form-control-warning": "")} form-control-sm text-center`} type="number" onChange={(e)=>this.handleChange(e,"Away")} value={awayData} name={id} placeholder="Away"/>
				</div>					
				);
		});		
		return (
			<div>
				<div className={"input-group row"} style={{height: "29px"}}>
			    <select className={"form-control form-control-sm"} name={"Player"} onChange={(e) => {this.handleChange(e, "Home")}}>
			      <option value="" selected disabled hidden>Home</option>
			      <option>Habib</option>
			      <option>Mahd</option>
			      <option>Talha</option>
			    </select>	
			    <span className={"input-group-addon"}>{"Player"}</span>	
			    <select className={"form-control form-control-sm"} name={"Player"} onChange={(e) => {this.handleChange(e, "Away")}}>
			      <option value="" selected disabled hidden>Away</option>
			      <option>Habib</option>
			      <option>Mahd</option>
			      <option>Talha</option>
			    </select>						    			    					
				</div>			
				{fields}
			</div>
			);
	}
}

export default MatchFacts