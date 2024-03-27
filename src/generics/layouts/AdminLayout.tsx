import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IRoute } from "../contexts/routing/route-typings";
import { adminRoutes, allRoutes } from "../contexts/routing/routes";
import { useAuthContextStore } from "../contexts/routing/AuthContext";

export const AdminLayout = () => {
  const [showMenu, setShowMenu] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isLoggedIn, isAnAdmin } = useAuthContextStore();
  useEffect(() => {
    const route: IRoute = adminRoutes.find((aR) => {
      const lastPathSegment = pathname.split("/").pop();
      const queryStrippedPath = aR.path.split("?")[0].split("#")[0];
      return lastPathSegment === queryStrippedPath;
    }) as IRoute;
    
    if ((!route) || (!isLoggedIn) || (!isAnAdmin))  {
      toast.error("you are not logged in as admin to access this page");
      navigate("/login");
    }
  });

  return (
    <div>
      <div className="p-4" role="button" onClick={() => setShowMenu(!showMenu)}>
        <div className="navbar-brand">
          <i className="fa fa-menu"></i>
          Dashboard
        </div>
      </div>
      <div className="row">
        {showMenu && (
          <div className="col-sm-2">
            <div>
              <button className="w-100 btn btn-sm bg-dark">
                <Link to="/admin/cluster/clusters">Cluster</Link>
              </button>
              <button className="w-100 btn btn-sm bg-dark">
                <Link to="/admin/cluster/clusters">Cluster</Link>
              </button>
            </div>
          </div>
        )}
        <div className={showMenu ? "col-sm-10" : "col-sm-12"}>
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
