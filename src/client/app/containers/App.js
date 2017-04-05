import React from 'react';
import { connect } from 'react-redux';
import 'client/assets/styles/main.less';

const App = ({ children }) => <div> Hello World{children}</div>;

App.propTypes = {
  children: React.PropTypes.node
};

App.defaultProps = {
  children: undefined
};

export const mapStateToProps = () => ({});

export default connect(mapStateToProps)(App);
