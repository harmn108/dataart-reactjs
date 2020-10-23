import React from "react";
import { Switch, Route } from "react-router-dom";
import AddNotice from "./components/Notices/AddNotice";
import EditNotice from "./components/Notices/EditNotice";
import ViewNotice from "./components/Notices/ViewNotice";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Dashboard from "./containers/Dashboard";

const RoutesList = () => (
  <Switch>
    <Route path="/" exact>
      <Dashboard />
    </Route>
    <Route
      exact
      path="/directories/:id"
      render={(props) => <Dashboard {...props} />}
    />
    <Route
      exact
      path="/notice/add"
      render={(props) => <AddNotice {...props} />}
    />
    <Route
      exact
      path="/notice/:id"
      render={(props) => <ViewNotice {...props} />}
    />
    <Route
      exact
      path="/notice/edit/:id"
      render={(props) => <EditNotice {...props} />}
    />
    <Route path="*" exact={true} component={PageNotFound} />
  </Switch>
);

export default RoutesList;
