import React, { Suspense } from "react";
import { Route, Navigate, Routes } from "react-router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Main from "../pages/main";
import Home from "../pages/home";
import NotFound from "../pages/notFound.jsx";
import PasswordReset from "../components/passwordReset";

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Navigate to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
};
export default function AppRoutes() {
  return (
    <>
      <Suspense
        fallback={
          <Skeleton
            count={1}
            className='fallback-main'
          />
        }>
        <Routes>
          <Route
            exact
            path='/'
            element={
              <Navigate replace to="/login" />
            }
          />
          <Route
            exact
            path='/login'
            element={<Main />}
          />
          <Route
            exact
            path="/login/password-reset"
            element={
              <PasswordReset></PasswordReset>
            }
          />
          <Route
            exact
            path="/home"
            element={
              <Home />
            }
          />
          <Route path='*'
            element={<NotFound />}>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
