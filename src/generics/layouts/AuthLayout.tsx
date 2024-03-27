import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify";
import { userRoutes } from "../contexts/routing/routes";
import { IRoute } from "../contexts/routing/route-typings";
import { useEffect } from "react";
import { useAuthContextStore } from "../contexts/routing/AuthContext";
//import "../assets/css/bootstrap.min.css";
export const AuthLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isLoggedIn, isAnAdmin } = useAuthContextStore();
  useEffect(() => {
    const route: IRoute = userRoutes.find((aR) => {
      const lastPathSegment = pathname.split("/").pop();
      const queryStrippedPath = aR.path.split("?")[0].split("#")[0];
      return lastPathSegment === queryStrippedPath;
    }) as IRoute;
    
    if (route?.isAuth && ((!route) || (!isLoggedIn))) {
      toast.error("you are not logged in to access this page");
      navigate("/login");
    }
  });
    return (
        <>
            <Outlet />
        </>
    )
}