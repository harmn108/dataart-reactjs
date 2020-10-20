import React from "react";
import { NavLink } from "react-router-dom";

const navigation = (props) => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/department">Department</NavLink>
          </li>
          <li>
            <NavLink to="/category">Category</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default navigation;
