import React from 'react';
import { connect } from 'react-redux';
import 'client/assets/styles/main.less';
import MatchStats from './MatchStats.js';
//import t from 'client/assets/images/fifa18.jpg';
const App = ({ children }) => <div>{"App"}</div>;

App.propTypes = {
  children: React.PropTypes.node
};

App.defaultProps = {
  children: undefined
};

export const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(App);
