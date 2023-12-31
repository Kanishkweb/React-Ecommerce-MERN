import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom/cjs/react-router-dom.min";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <Fragment>
      {!loading && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated===false) {
              return <Redirect to="/login" />;
            }

            return <Component {...props} />;
          }}
        />
      )}
    </Fragment>
  );
};

export default ProtectedRoute;
