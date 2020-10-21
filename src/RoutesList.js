import React from "react";
import { Switch, Route } from "react-router-dom";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Dashboard from "./containers/Dashboard";

const RoutesList = () => (
  <Switch>
    <Route path="/" exact>
      <Dashboard />
    </Route>
    <Route path="/directories/:id" render={(props) => <Dashboard {...props} />}/> 
    <Route path='*' exact={true} component={PageNotFound} />
  </Switch>
);

export default RoutesList;
