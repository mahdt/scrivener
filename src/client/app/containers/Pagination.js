import React from 'react';

class Pagination extends React.Component {
	constructor(props) {
		super(props);
		this.state = {active: 0};
		this.handleNavButton = this.handleNavButton.bind(this);
		this.handleTabButton = this.handleTabButton.bind(this);
	}

componentWillUpdate(nextProps, nextState) {
  if (nextState.active !== this.state.active) {
  	this.props.handleChange(this.props.data[nextState.active]);
  }
}	

	handleNavButton(e) {
		var dir = e.target.innerText;
		var selected = this.state.active;
		var size = this.props.data.length;
		if(dir === "Next") {
			if(selected < (size-1)) {
				this.setState({active: ++selected});
			}
		} else {
			if(selected > 0) {
				this.setState({active: --selected});
			}
		}
	}

	handleTabButton(e) {
		this.setState({active: parseInt(e.target.id)})
	} 	 

	render() {
		let tab = this.props.data.map((str, index) => {
			return (
				<li className={`page-item ${this.state.active === index ? "active" : ""}`}><a id={index} onClick={this.handleTabButton} className={"page-link"} href="#">{str}</a></li>
			);		
		}); 	
			
		return (
			<nav>
				<div className={"d-flex justify-content-center"}>
					<ul className={"pagination"}>
						<li className={`page-item ${this.state.active === 0 ? "disabled": ""}`}><a className={"page-link"} onClick={this.handleNavButton} href="#">Previous</a></li>
						{tab}
						<li className={`page-item ${this.state.active === this.props.data.length-1 ? "disabled": ""}`}><a className={"page-link"} onClick={this.handleNavButton} href="#">Next</a></li>
					</ul>
				</div>	
			</nav>			
		);
	}
}

export default Pagination