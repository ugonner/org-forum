import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { userRoutes } from "../contexts/routing/routes";
import { IRoute } from "../contexts/routing/route-typings";
import { useEffect } from "react";
import { useAuthContextStore } from "../../auth/contexts/AuthContext";
import { Header } from "../components/Header";
import { useThemeContextStore } from "../contexts/theme/theme";
//import "../assets/css/bootstrap.min.css";
export const AuthLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {themeCssClass} = useThemeContextStore()
  const { isLoggedIn, isAnAdmin } = useAuthContextStore();
  useEffect(() => {
    const route: IRoute = userRoutes.find((aR) => {
      const lastPathSegment = pathname.split("/")[3];
      const queryStrippedPath = aR.path
        .split("?")[0]
        .split("#")[0]
        .split("/")[0];
      return lastPathSegment === queryStrippedPath;
    }) as IRoute;

    if (route?.isAuth && !isLoggedIn) {
      toast.error("you are not logged in to access this page");
      navigate("/auth/login");
    }
  });
  return (
    <div>
      <Header />

      <div className={`p-3 ${themeCssClass}`}>
        <Outlet />

        <div className="footer my-5">
          <h6 className="font-weight-bold p-3 ">
            &copy; {new Date().getFullYear()} Bonaventure, AppLawsIT
          </h6>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};
