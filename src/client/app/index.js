import React from 'react';
import configureStore from 'client/app/redux/store/configure-store';
import render from 'client/app/render';
import reducer from 'client/app/reducer';

import Root from 'client/app/Root';


const initialState = window.__INITIAL_STATE__;
const store = configureStore(reducer, initialState);

const bootstrap = () => render(<Root store={store} />, 'scrivener');


if (module.hot) {
  module.hot.accept('client/app/Root', () => bootstrap());
}

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', bootstrap);
} else {
  window.attachEvent('onload', bootstrap);
}
