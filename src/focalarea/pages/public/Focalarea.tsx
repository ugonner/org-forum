import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IUserDTO } from "../../../user/typings/user";
import { IPostDTO } from "../../../post/typings/post";
import { IFocalareaDTO } from "../../typings/focalarea";
import {
  IAddOrRemoveFromGroupDTO,
  QueryReturn,
} from "../../../generics/typings/typngs";
import { camelCaseNameFormatter } from "../../../generics/utils/camelCaseNameFormatter";
import { ItemCard } from "../../../generics/components/ItemCard";
import { defaultPostImageUrl, getPosts } from "../../../post/contexts/post";
import { toast } from "react-toastify";
import { getFocalarea } from "../../contexts/focalarea";
import { Query } from "react-query";
import { addOrRemoveUserFromGroup, getUsers } from "../../../user/contexts/api/user";
import { useModalContextStore } from "../../../generics/components/modals/ModalContextProvider";

export const Focalarea = () => {
  const navParam = useParams();
  const focalareaId = navParam.focalareaId;
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState({} as QueryReturn<IUserDTO>);
  const [posts, setPosts] = useState({} as QueryReturn<IPostDTO>);
  const [focalarea, setFocalarea] = useState({} as IFocalareaDTO);
  const [isMember, setIsMember] = useState(false);
  const localUserString = localStorage.getItem("user");
  const localUser = JSON.parse(localUserString as string);
  const {setLoader} = useModalContextStore();
  useEffect(() => {
    (async () => {
      try {
        
      setLoader({showLoader: true, loaderText: "loading data"})
        const focalareaRes = await getFocalarea(`${focalareaId}`);
        setLoader({showLoader: false, loaderText: ""})
        const query = {
          focalareas: `${focalareaId}`,
          _page: 1,
          _orderBy: "createdAt",
          _order: "DESC",
        };
        setLoader({showLoader: true, loaderText: "posts comming"})
        const postsRes = await getPosts({ ...query });
        const usersRes = await getUsers({ ...query });
        postsRes && setPosts(postsRes);
        usersRes && setUsers(usersRes);
        focalareaRes && setFocalarea(focalareaRes);

        usersRes.docs.find((user) => user._id == localUser.userId) &&
          setIsMember(true);
          setLoader({showLoader: false, loaderText: ""})
      } catch (error) {
        setLoader({showLoader: false, loaderText: ""})
        toast.error((error as any).message);
      }
    })();
  }, []);


  return (
    <div className="row">
      <div className="col-2">
        <div className="btn w-100" role="button" onClick={() => setPage(1)}>
          <div className="img-responsive">
            <img
              src={focalarea.avatar}
              className="img-fluid"
              alt="focalarea logo"
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
      </div>
      <div className="col-10">
        {page === 1 && (
          <div className="row">
            <div className="col-12">
              <div className="my-3">
                <span className="d1">{focalarea.focalareaName}</span>
              </div>
            </div>
            {Object.keys(focalarea).map((field) => (
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
                        <span>{(focalarea as any)[field].split("T")[0]}</span>
                      )}
                      {field !== "updatedAt" && (
                        <span>{(focalarea as any)[field]}</span>
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
      </div>
    </div>
  );
};
