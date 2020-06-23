import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import App from './components/App';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import Login from './components/Login';
import Recover from './components/Recover';
import New from './components/New';
import Poll from './components/Poll';
import Update from './components/Update';
import NotFound from './components/NotFound';

import './index.css';

// Needed for onClick
// http://stackoverflow.com/a/34015469/988941

//A note on security: users can access data as explained in the use cases, but they can not modify data beyond that
//All client-based code can be tampered with, so this app relies on server-side validation of data on the firebase side

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/EL-Creative-Polls/' component={App}> 
      <IndexRoute component={Home} />
      <Route path="/EL-Creative-Polls/dashboard" component={Dashboard} /> 
      <Route path="/EL-Creative-Polls/signup" component={Signup} />
      <Route path="/EL-Creative-Polls/login" component={Login} />
      <Route path="/EL-Creative-Polls/recover" component={Recover} />
      <Route path="/EL-Creative-Polls/new" component={New} />
      <Route path="/EL-Creative-Polls/update/:pollId" component={Update} />
      <Route path="/EL-Creative-Polls/poll/:pollId" component={Poll} />
      <Route path="/EL-Creative-Polls/*" component={NotFound} />
    </Route>
  </Router>,
  document.getElementById('root')
);

