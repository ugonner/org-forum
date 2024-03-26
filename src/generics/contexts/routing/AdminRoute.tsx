import { Navigate, Route } from "react-router-dom";
import { IRoute } from "./route-typings"
import { useAuthContextStore } from "./AuthContext";

export interface IAuthRouteProp {
    routeElements: IRoute[];

}

export const AdminRoute = (prop: IRoute) => {
    const {isLoggedIn, isAnAdmin} = useAuthContextStore();

    return prop.isAuth && isLoggedIn && isAnAdmin 
    ? (
    <Route path={`/admin/${prop.appDomain}/`}>
        <Route path={`/admin/${prop.appDomain}/${prop.path}`} element={<prop.element {...prop.props} />} />
    </Route>
)
    : (<Navigate to={"/login"} />)
    };
