import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IUserDTO } from "../../../user/typings/user";
import { IPostDTO } from "../../../post/typings/post";
import { IClusterDTO } from "../../typings/cluster";
import {
  IAddOrRemoveFromGroupDTO,
  QueryReturn,
} from "../../../generics/typings/typngs";
import { camelCaseNameFormatter } from "../../../generics/utils/camelCaseNameFormatter";
import { ItemCard } from "../../../generics/components/ItemCard";
import { defaultPostImageUrl, getPosts } from "../../../post/contexts/post";
import { toast } from "react-toastify";
import { getCluster } from "../../contexts/cluster";
import { Query } from "react-query";
import { addOrRemoveUserFromGroup, getUsers } from "../../../user/contexts/api/user";
import { useModalContextStore } from "../../../generics/components/modals/ModalContextProvider";

export const Cluster = () => {
  const navParam = useParams();
  const clusterId = navParam.clusterId;
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState({} as QueryReturn<IUserDTO>);
  const [posts, setPosts] = useState({} as QueryReturn<IPostDTO>);
  const [cluster, setCluster] = useState({} as IClusterDTO);
  const [isMember, setIsMember] = useState(false);
  const localUserString = localStorage.getItem("user");
  const localUser = JSON.parse(localUserString as string);
  const {setLoader} = useModalContextStore()
  useEffect(() => {
    (async () => {
      try {
        setLoader({showLoader: true, loaderText: "getting cluster"})
        const clusterRes = await getCluster(`${clusterId}`);
        const query = {
          clusters: `${clusterId}`,
          _page: 1,
          _orderBy: "createdAt",
          _order: "DESC",
        };
        setLoader({showLoader: true, loaderText: "posts and activities coming"})
        const postsRes = await getPosts({ ...query });
        const usersRes = await getUsers({ ...query });
        postsRes && setPosts(postsRes);
        usersRes && setUsers(usersRes);
        clusterRes && setCluster(clusterRes);

        usersRes.docs.find((user) => user._id == localUser.userId) &&
          setIsMember(true);
          setLoader({showLoader: false, loaderText: ""})
      } catch (error) {
        setLoader({showLoader: false, loaderText: ""})
        toast.error((error as any).message);
      }
    })();
  }, []);

  const addOrRemoveFromEntity = async (forwardAction: boolean) => {
    try {
      const payload: IAddOrRemoveFromGroupDTO<string> = {
        primaryId: `${localUser.userId}`,
        propertyValue: `${cluster._id}`,
        forwardAction,
        propertyName: "clusters"
      };
      await addOrRemoveUserFromGroup(payload);
      setIsMember((!isMember))
    } catch (error) {
      toast.error((error as any).message);
    }
  };

  return (
    <div className="row">
      <div className="col-2">
        <div className="btn w-100" role="button" onClick={() => setPage(1)}>
          <div className="img-responsive">
            <img
              src={cluster.avatar}
              className="img-fluid"
              alt="cluster logo"
            />
          </div>
        </div>

        <div className="btn w-100" role="button" onClick={() => setPage(2)}>
          <div className="img-responsive">
            <h3>
              <i className="fas fas-book"></i>{" "}
            </h3>
            <h6>
              {" "}
              <span className="font-weight-bolder">{posts.totalDocs}</span>{" "}
              Posts
            </h6>
          </div>
        </div>
        <div className="btn w-100" role="button" onClick={() => setPage(3)}>
          <div className="img-responsive">
            <h3>
              <i className="fas fas-user"></i>{" "}
            </h3>
            <h6>
              {" "}
              <span className="font-weight-bolder">{users.totalDocs}</span> |
              Users
            </h6>
          </div>
        </div>
      </div>
      <div className="col-10">
        {page === 1 && (
          <div className="row">
            <div className="col-12">
              <div className="my-3">
                <span className="d1">{cluster.clusterName}</span>
                <span
                  className="btn mx-4"
                  role="button"
                  onClick={() => addOrRemoveFromEntity(isMember ? false : true)}
                >
                 {isMember ? "Leave" : "Join"}
                </span>
              </div>
            </div>
            {Object.keys(cluster).map((field) => (
              <div key={field}>
                {![
                  "__v",
                  "_id",
                  "createdAt",
                  "noOfPosts",
                  "users",
                  "avatar",
                ].includes(field) && (
                  <div className="row">
                    <div className="col-sm-3">
                      {camelCaseNameFormatter(field)}
                    </div>
                    <div className="col-sm-9">
                      {field === "updatedAt" && (
                        <span>{(cluster as any)[field].split("T")[0]}</span>
                      )}
                      {field !== "updatedAt" && (
                        <span>{(cluster as any)[field]}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {page === 2 &&
          (posts.docs?.length > 0 ? (
            <ItemCard
              items={posts.docs.map((p) => ({
                header: p.title,
                shortDescription: p.content as string,
                avatar: `${p.media?.mediaUrl ?? defaultPostImageUrl}`,
                linkHref: `/post/viewpost/${p._id}`,
                linkButtonText: "Read More",
              }))}
            />
          ) : (
            <div className="text-center">
              <h3> No Posts Yet</h3>
            </div>
          ))}

        {page === 3 &&
          (users.docs?.length > 0 ? (
            <ItemCard
              items={users.docs.map((u) => ({
                header: `${u.firstName ?? ""}, ${u.lastName ?? ""}`,
                shortDescription: `${u.address ?? ""}`,
                avatar: `${u.avatar ?? defaultPostImageUrl}`,
                linkHref: `/user/profile/${u._id}`,
                linkButtonText: "View Profile",
              }))}
            />
          ) : (
            <div className="text-center">
              <h3> No Users Yet</h3>
            </div>
          ))}
      </div>
    </div>
  );
};
