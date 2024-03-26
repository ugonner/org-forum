import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AdminLayout = () => {
  const [showMenu, setShowMenu] = useState(true)
    return (
    <div>
        <div className="p-4" role="button" onClick={() => setShowMenu(!showMenu)}>
            <div className="navbar-brand">
            <i className="fa fa-menu"></i>
             Dashboard</div>
        </div>
      <div className="row">
        {
            showMenu && (
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
            )
        }
        <div className={showMenu ? "col-sm-10" : "col-sm-12"}>
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
