import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

const render = (component, id) => {
  ReactDOM.render(
    <AppContainer>
      {component}
    </AppContainer>,
    document.getElementById(id)
  );
};

export default render;
