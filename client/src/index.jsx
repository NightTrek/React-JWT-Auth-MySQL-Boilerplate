import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reduxThunk from "redux-thunk";


// Import Containers
import Counter from "./containers/Counter";
import Signout from "./containers/Authentication/Signout";

import './style.css';


// Import components
import Welcome from "./components/Welcome";

import reducers from "./reducers";

// configure redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  {
    auth: { authenticated: localStorage.getItem("token") }
  },
  composeEnhancers(applyMiddleware(reduxThunk))
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/counter" component={Counter} />
          <Route exact path="/signout" component={Signout} />
    </Router>
  </Provider>,
  document.getElementById("root")
);
