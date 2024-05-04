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
import {
  adminRoutes,
  allRoutes,
  userRoutes,
} from "./generics/contexts/routing/routes";
import { AuthProvider } from "./auth/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { ModalContextProvider } from "./generics/components/modals/ModalContextProvider";
import { ThemeContextProvider } from "./generics/contexts/theme/theme";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <AuthProvider>
          <ModalContextProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" Component={HomePage} />
                <Route path="/register" element={<RegisterUser />} />

                <Route path="/" element={<AuthLayout />}>
                  {userRoutes.map((aRoute, i) => (
                    <Route key={i} path={`/${aRoute.appDomain}`}>
                      <Route
                        path={`/${aRoute.appDomain}/${aRoute.path}`}
                        element={<aRoute.element {...aRoute.props} />}
                      />
                    </Route>
                  ))}
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                  {adminRoutes.map((aRoute, i) => (
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
          </ModalContextProvider>
        </AuthProvider>
      </ThemeContextProvider>
    </QueryClientProvider>
  );
}

export default App;
