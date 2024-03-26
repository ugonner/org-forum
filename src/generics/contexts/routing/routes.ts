import { ClusterMgt } from "../../../cluster/pages/ClusterMgt";
import { FocalareaMgt } from "../../../focalarea/pages/FocalareaMgt";
import { AppDomains, IRoute, IRouteGroup } from "./route-typings";

export const allRoutes: IRoute[] = [
    {
        path: "/cluster-ngt",
        element: ClusterMgt,
        appDomain: AppDomains.CLUSTER,
        isAdmin: true,
        isAuth: true
    },
    {
        path: "/focalarea-mgt",
        element: FocalareaMgt,
        appDomain: AppDomains.FOCALAREA,
        isAdmin: true,
        isAuth: true
    }
]