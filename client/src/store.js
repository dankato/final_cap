import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { mainReducer } from './reducers';
// import rootReducer from './reducers';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
    mainReducer,
    // rootReducer,
    composeEnhancers(applyMiddleware(thunk))
);