import { RequestForgotPassword } from "../../../auth/pages/ForgotPassword";
import { LoginUser } from "../../../auth/pages/Login";
import { RegisterUser } from "../../../auth/pages/Register";
import { VerifyEmailToken } from "../../../auth/pages/VerifyEmail";
import { ClusterMgt } from "../../../cluster/pages/ClusterMgt";
import { FocalareaMgt } from "../../../focalarea/pages/FocalareaMgt";
import { AppDomains, IRoute, IRouteGroup } from "./route-typings";

export const allRoutes: IRoute[] = [
    {
        path: "register",
        element: RegisterUser,
        appDomain: AppDomains.AUTH,
        isAdmin: false,
        isAuth: false
    },
    {
        path: "login",
        element: LoginUser,
        appDomain: AppDomains.AUTH,
        isAdmin: false,
        isAuth: false
    },
    {
        path: "verify-user",
        element: VerifyEmailToken,
        appDomain: AppDomains.AUTH,
        isAdmin: false,
        isAuth: false
    },
    {
        path: "forgot-password",
        element: RequestForgotPassword,
        appDomain: AppDomains.AUTH,
        isAdmin: false,
        isAuth: false
    },
    {
        path: "cluster-mgt",
        element: ClusterMgt,
        appDomain: AppDomains.CLUSTER,
        isAdmin: true,
        isAuth: true
    },
    {
        path: "focalarea-mgt",
        element: FocalareaMgt,
        appDomain: AppDomains.FOCALAREA,
        isAdmin: true,
        isAuth: true
    }
]

export const adminRoutes = allRoutes.filter((route) => route.isAdmin);
export const userRoutes = allRoutes.filter((route) => !route.isAdmin);