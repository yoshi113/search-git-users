import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthCallback from './AuthCallback';
import Layout from './Layout';
import SearchPage from './SearchPage';
import UsersPage from './UsersPage';
import TestPage from './TestPage';

import axios from 'axios';

const AuthRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (axios.defaults.headers.common['Authorization'] === undefined) {
        localStorage.setItem('path', props.location.pathname);
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${
          process.env.REACT_APP_GITHUB_CLIENT_ID
        }`;
        return;
      }
      return <Layout component={component} {...props} />;
    }}
  />
);

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/callback" component={AuthCallback} />
        <AuthRoute exact path="/search" component={SearchPage} />
        <AuthRoute exact path="/users" component={UsersPage} />
        <AuthRoute exact path="/test" component={TestPage} />
        <Redirect to="/search" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
