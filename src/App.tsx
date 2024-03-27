import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "./home/pages/Home";
import { RegisterUser } from "./auth/pages/Register";
import { LoginUser } from "./auth/pages/Login";
import { AuthLayout } from "./generics/layouts/AuthLayout";
import { VerifyEmailToken } from "./auth/pages/VerifyEmail";
import { RequestForgotPassword } from "./auth/pages/ForgotPassword";
import { AdminLayout } from "./generics/layouts/AdminLayout";
import { ClusterMgt } from "./cluster/pages/ClusterMgt";
import { allRoutes } from "./generics/contexts/routing/routes";
import { AuthRoute } from "./generics/contexts/routing/AuthRoute";
import { AuthProvider } from "./generics/contexts/routing/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/register" element={<RegisterUser />} />

          <Route path="/auth" element={<AuthLayout />}>
            <Route path="/auth/register" element={<RegisterUser />} />
            <Route path="/auth/login" element={<LoginUser />} />
            <Route path="/auth/verify-user" element={<VerifyEmailToken />} />
            <Route
              path="/auth/forgot-password"
              element={<RequestForgotPassword />}
            />
          </Route>

          <Route path="/post"></Route>

          <Route path="/admin" element={<AdminLayout />}>
            {allRoutes.map((aRoute, i) => (
              <Route key={i} path={`/admin/${aRoute.appDomain}`}>
                <Route
                  path={`/admin/${aRoute.appDomain}/${aRoute.path}`}
                  element={<aRoute.element {...aRoute.props} />}
                />
              </Route>
            ))}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
