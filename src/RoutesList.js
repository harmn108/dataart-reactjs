import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home/Home";
import Department from "./Department/Department";
import Category from "./Category/Category";

const routesList = () => (
  <Switch>
    <Route path="/" exact>
      <Home />
    </Route>
    <Route path="/department">
      <Department />
    </Route>
    <Route path="/category">
      <Category />
    </Route>
  </Switch>
);

export default routesList;
