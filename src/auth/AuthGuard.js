import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

const AuthGuard = ({ component: Component, ...props }) => (
  <Route
    {...props}
    render={(routeProps) => {
      const userToken = sessionStorage.getItem("token");

      // Do all your conditional tests here
      return userToken !== null ? (
        <Component {...routeProps} />
      ) : (
        <Redirect exact to={`${process.env.PUBLIC_URL}/login`} />
      );
    }}
  />
);
export default AuthGuard;
