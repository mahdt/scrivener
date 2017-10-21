import React from 'react';
import { Route } from 'react-router';
import App from 'client/app/containers/App';
import NewMatches from 'client/app/containers/NewMatches';

export default (
	<main>
  		<Route exact path="/" component={App}/>
  		<Route path="/NewMatches" component={NewMatches}/>
  	</main>
);

