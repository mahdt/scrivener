import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import createLogger from 'redux-logger';
import { persistState } from 'redux-devtools';
import createImmutableInvariant from 'redux-immutable-state-invariant';

const sagaMiddleware = createSagaMiddleware();

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0) ? matches[1] : null;
}

export default function configureStore(reducer, initialState) {
  const loggerMiddleware = createLogger();
  const immutableInvariantMiddleware = createImmutableInvariant();
  const middleware = [
    sagaMiddleware,
    loggerMiddleware,
    immutableInvariantMiddleware
  ];

  const enhancers = [
    applyMiddleware(...middleware),
    persistState(getDebugSessionKey())
  ];
  const composeEnhancers = composeWithDevTools({
    name: 'SCRIVENER'
  });
  const store = createStore(reducer, initialState, composeEnhancers(...enhancers));

  window.store = store;

  return store;
}
