import { useState } from "react"
import { IUserDTO } from "../typings/user"
import { useNavigate } from "react-router-dom"
import { defaultUserImageUrl } from "../contexts/api/user"
import { ICategoryDTO } from "../../category/typings/category"
import { IClusterDTO } from "../../cluster/typings/cluster"

export interface IUserProp {
    user: IUserDTO
}
export const User = (prop: IUserProp) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(prop.user)
    return (
        <div className="row">
            <div className="col-2">
                <img src={user.avatar ?? defaultUserImageUrl} alt={`image of ${user.firstName}`} className="img-fluid" />
            </div>
            <div className="col-10">
                <p className="">
                    <span
                    className=""
                    role="button"
                    onClick={() => navigate(`/user/profile/${user._id}`)}
                    >
                        {user.firstName ?? ""}, {user.lastName ?? ""}
                    </span>
                    <br/>
                    <span className="d6">
                        {
                            (user.clusters as IClusterDTO[])?.map((cluster, i) => (
                                <span 
                                key={i}
                                className=""
                                role="button"
                                onClick={() => navigate(`/cluster/view/${cluster._id}`)}
                                >
                                    {cluster.clusterName}
                                </span> 
                            ))
                        }
                    </span>
                </p>
            </div>
        </div>
    )
}