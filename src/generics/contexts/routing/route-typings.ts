import { ClusterMgt } from "../../../cluster/pages/ClusterMgt";
import { FocalareaMgt } from "../../../focalarea/pages/FocalareaMgt";

export enum AppDomains {
    CLUSTER = "cluster",
    FOCALAREA = "focalarea",
    POST = "post",
    USER = "user",
    AUTH = "auth",
    CATEGORY = "category"
}

export interface IRouteGroup {
    cluster: IRoute[];
    focalarea: IRoute[];
    post: IRoute[];
    user: IRoute[];
    auth: IRoute[];
}

export interface IRoute {
    path: string;
    element: () => JSX.Element;
    isAdmin: boolean;
    isAuth: boolean;
    appDomain: AppDomains;
    props?: {[key: string]: string};
}


