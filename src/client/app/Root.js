import React from 'react';
import { Provider } from 'react-redux';
import DevTools from 'client/app/DevTools';
import { Router, browserHistory } from 'react-router';
import routes from 'client/app/routes';

const RootDev = ({ store }) => (
  <Provider store={store}>
    <div>
      <Router history={browserHistory} routes={routes} />
      <DevTools />
    </div>
  </Provider>
);

const RootProd = ({ store }) => (
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
);


RootDev.propTypes = {
  store: React.PropTypes.object.isRequired,
};

RootProd.propTypes = {
  store: React.PropTypes.object.isRequired,
};

// if (process.env.NODE_ENV === 'development') {
export default RootDev;
// } else {
//   module.exports = RootProd;
// }
