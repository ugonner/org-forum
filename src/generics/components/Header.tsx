import React from "react";
import { useAuthContextStore } from "../../auth/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ITheme, useThemeContextStore } from "../contexts/theme/theme";

export const Header: React.FC = () => {
  const { isLoggedIn, logOut } = useAuthContextStore();
  const localUserString = localStorage.getItem("user");
  const localUser = JSON.parse(`${localUserString}`);
  const navigate = useNavigate();
  const {themeCssClass, setThemeCssClass, tableThemeCssClass, setTableThemeCssClass} = useThemeContextStore()
  
  return (
    <nav
      className="custom-navbar navbar navbar navbar-expand-md navbar-dark bg-dark"
      arial-label="navigation bar"
    >
      <div className="container">
        <a className="navbar-brand" href="/">
          Jonapwd<span>.</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarsFurni"
          aria-controls="navbarsFurni"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsFurni">
          <ul className="custom-navbar-nav navbar-nav ms-auto mb-2 mb-md-0">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
            <li>
              <a className="nav-link" href="/#focalareas">
                Thematic Areas
              </a>
            </li>
            <li>
              <a className="nav-link" href="/#about">
                About us
              </a>
            </li>
            <li>
              <a className="nav-link" href="/#clusters">
                Clusters
              </a>
            </li>
            <li>
              <a className="nav-link" href="/#activities">
                Activities
              </a>
            </li>
            <li>
              <a className="nav-link" href="/#contact">
                Contact us
              </a>
            </li>
          </ul>

          {localUser?.userId ? (
            <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
             <li 
             className=""
             role="button"
             onClick={() => {
              const themeData: ITheme = {} as ITheme;
              if(/bg-dark/i.test(themeCssClass)){
                themeData.themeCssClass = `bg-light text-dark`;
                themeData.tableThemeCssClass = `table-light text-dark`
                setThemeCssClass(`${themeData.themeCssClass}`);
                setTableThemeCssClass(`${themeData.tableThemeCssClass}`)
                
              }else{
                themeData.themeCssClass = `bg-dark text-light`;
                themeData.tableThemeCssClass = `table-dark text-light`;

                setThemeCssClass(`${themeData.themeCssClass}`);
                setTableThemeCssClass(themeData.tableThemeCssClass)
              }
              localStorage.setItem("themeData", JSON.stringify(themeData));
             }}
             >
              toggle theme
             </li>
              <li>
                <span
                  role="button"
                  className="nav-link"
                  onClick={() => {
                    logOut()
                    navigate(`/auth/login`)
                  }}
                >
                  <i className="fa fa-power-off"></i>
                </span>
              </li>
              <li>
                <span
                  role="button"
                  className="nav-link"
                  onClick={() => navigate(`/user/profile/${localUser.userId}`)}
                >
                  <i className=""> {localUser.firstName} </i>
                </span>
              </li>
            </ul>
          ) : (
            <ul className="custom-navbar-cta navbar-nav mb-2 mb-md-0 ms-5">
              <li>
                <span
                  role="button"
                  className="nav-link"
                  onClick={() => navigate(`/auth/login`)}
                >
                  <i className="fa fa-sign-in"></i>
                </span>
              </li>
              <li>
                <span
                  role="button"
                  className="nav-link"
                  onClick={() => navigate(`/auth/register`)}
                >
                  <i className="fa fa-login"></i>
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};
