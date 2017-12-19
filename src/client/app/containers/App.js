import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import 'client/assets/styles/main.less';
import Navbar from '../components/Navbar.js';
import Main from './Main.js';

const App = ({ children }) => {
	return (
		<div><Navbar/><Main/></div>
		)};

App.propTypes = {
  children: React.PropTypes.node
};

App.defaultProps = {
  children: undefined
};

export const mapStateToProps = (state) => ({});

export default withRouter(connect(mapStateToProps)(App));
