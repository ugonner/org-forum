import { Navigate, Route } from "react-router-dom";
import { IRoute } from "./route-typings"
import { useAuthContextStore } from "./AuthContext";

export interface IAuthRouteProp {
    routeElements: IRoute[];

}

export const AuthRoute = (prop: IRoute) => {
    const {isLoggedIn} = useAuthContextStore();

    return prop.isAuth && isLoggedIn 
    ? (
    <Route path={`/${prop.appDomain}/`}>
        <Route path={`/${prop.appDomain}/${prop.path}`} element={<prop.element {...prop.props} />} />
    </Route>
)
    : (<Navigate to={"/login"} />)
    };
