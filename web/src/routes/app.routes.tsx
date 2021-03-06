import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Route from './redirect.routes';

const Routes: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/dashboard" component={Dashboard} isPrivate />
          <Route path="/profile" component={Profile} isPrivate />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default Routes;
