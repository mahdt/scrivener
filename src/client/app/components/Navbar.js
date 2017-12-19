import React from 'react';
import { Link } from 'react-router-dom'

class Navbar extends React.Component {
	render() {
		return (
			<nav className={"navbar sticky-top navbar-toggleable-md navbar-light bg-faded"}>
			  <button className={"navbar-toggler navbar-toggler-right"} type={"button"} data-toggle="collapse" data-target={"#navbarSupportedContent"}>
			    <span className={"navbar-toggler-icon"}></span>
			  </button>
			  <h1 className={"navbar-brand mb-0"}>Scrivener</h1>

			  <div className={"collapse navbar-collapse"} id={"navbarSupportedContent"}>
			    <ul className={"navbar-nav mr-auto"}>
			      <li className={"nav-item active"}>
			        <Link className={"nav-link"} to='/'>Home</Link>
			      </li>
			      <li className={"nav-item"}>
			       <Link className={"nav-link"} to='/loader'>Loader</Link>
			      </li>
			      <li className={"nav-item"}>
			       <Link className={"nav-link"} to='/newmatches'>NewMatches</Link>
			      </li>				      			      
			    </ul>
			  </div>
			</nav>			
			);
	}
}

export default Navbar