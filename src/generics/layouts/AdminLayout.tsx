import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IRoute } from "../contexts/routing/route-typings";
import { AppDomainsArr, adminRoutes, allRoutes } from "../contexts/routing/routes";
import { useAuthContextStore } from "../../auth/contexts/AuthContext";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useThemeContextStore } from "../contexts/theme/theme";

export const AdminLayout = () => {
  const [showMenu, setShowMenu] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {themeCssClass} = useThemeContextStore()
  
  const { isLoggedIn, isAnAdmin } = useAuthContextStore();
  const [appDomainName, setAppDomainName] = useState("");
  useEffect(() => {
     setAppDomainName(pathname.split("/")[2]);
      
    const route: IRoute = adminRoutes.find((aR) => {
      const lastPathSegment = pathname.split("/")[3];
      const queryStrippedPath = aR.path.split("?")[0].split("#")[0].split("/")[0];
      return lastPathSegment === queryStrippedPath;
    }) as IRoute;
    
    if ((!route) || (!isLoggedIn) || (!isAnAdmin))  {
      toast.error("you are not logged in as admin to access this page");
      navigate("/auth/login");
    }
  });

  return (
    <div className={`PX-3 ${themeCssClass}`}>
      <Header />
      <div className="p-4" role="button" onClick={() => setShowMenu(!showMenu)}>
        <div className="navbar-brand">
          <i className="fa fa-menu"></i>
          Dashboard
        </div>
      </div>
      <div className="row">
        {showMenu && (
          <div className="col-sm-2">
            <div className="px-3">
              {
                AppDomainsArr.sort().map((domain) => domain !== "auth" ? (
                  
              <div 
              key={domain}
              className="my-4"
              role="button"
              aria-label="navigate to the admin panel of this section"
              onClick={() => navigate(`/admin/${domain}/${domain}-mgt`)}
              >
              {domain}
            </div>
                ) : (
                  <></>
                )
              )              }
            </div>
          </div>
        )}
        <div className={showMenu ? "col-sm-10" : "col-sm-12"}>
         
        <h1 className="text-capitalize">{appDomainName}</h1>
          <Outlet />
        </div>
      </div>
      <div className="footer my-5">
        <h6 className="font-weight-bold p-3 ">&copy; {new Date().getFullYear()} Bonaventure, AppLawsIT</h6>
      </div>
      <ToastContainer />
      
    </div>
  );
};
