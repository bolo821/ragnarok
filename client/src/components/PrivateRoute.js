import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './layout/Spinner';


function PrivateRoute ({ component: Component, ...rest }) {
  const auth = useSelector(state => state.auth);
  const { loading } = auth;

  return (
    <Route
      {...rest}
      render = {props =>
        loading ? (
          <Spinner />
        ) : 
          <Component {...props} />
      }
    />
  );
}

export default PrivateRoute;
