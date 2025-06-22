import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const withRouter = (Component) => {
  return (props) => {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={Component} />
          {/* Add additional routes here as needed */}
        </Switch>
      </Router>
    );
  };
};

export default withRouter;