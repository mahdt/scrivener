import React from 'react';

class Loader extends React.Component {
	render() {
		let target = <div className={"loader"}></div>;
		if(this.props.type === "progress") {
			target = (
				<div className={"progress"}  style={{width: '100%'}}>
				  <div className={"progress-bar progress-bar-striped progress-bar-animated"} role="progressbar" style={{width: this.props.progress+'%'}}>{this.props.progress + "%"}</div>
				</div>
				);
		}
		return (
			<div className={"d-flex justify-content-center"}>
				{target}
			</div>
			);
	}
}

export default Loader