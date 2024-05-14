import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { IGenericResponse, QueryReturn } from "../../../generics/typings/typngs";
import { IPostDTO } from "../../typings/post";
import { getPosts } from "../../contexts/post";
import { PostCard } from "./PostCard";
import { buildSearchObj } from "../../../generics/utils";
import { useModalContextStore } from "../../../generics/components/modals/ModalContextProvider";
import { toast } from "react-toastify";

export const Posts = () => {
  const { search } = useLocation();

  const navigate = useNavigate();
  const [_page, set_Page] = useState(1);
  const searchQuery = buildSearchObj(search);
  const [queryPayload, setQueryPayload] = useState({
    ...searchQuery,
    _page,
    _orderBy: "createdAt",
    _order: "DESC",
  } as { [key: string]: string | number });
  //const {data: posts, error} = useGetPostsQuery(queryPayload);
  const [posts, setPosts] = useState({} as QueryReturn<IPostDTO>);
  const {setLoader} = useModalContextStore()
  useEffect(() => {
    (async () => {
      try{
        
        setLoader({showLoader: true, loaderText: "fetching posts"});
      const postsRes = await getPosts(queryPayload);
      setPosts(postsRes);
      setLoader({showLoader: false, loaderText: ""});
      }catch(error){
        setLoader({showLoader: false, loaderText: ""});
        toast.error((error as IGenericResponse<unknown>).message)
      }
    })();
  }, [queryPayload]);

  return (
    <div className="row">
      <div className="col-4">
        <input
          className="form-control"
          aria-label="search posts"
          placeholder="search posts"
          onChange={(e) => {
            if (e.target.value.length < 3) return;
            setQueryPayload({
              _searchBy: e.target.value,
              _orderBy: "firstName",
              _order: "DESC",
              _page,
            });
          }}
        />
      </div>
      <div className="col-4">
        <h1>Posts | {posts?.totalDocs}</h1>
      </div>
      <div className="col-4">
        <div
          className="text-center"
          role="button"
          onClick={() => navigate(`/post/create/create${search}`)}
        >
          Create New Post
        </div>
      </div>
      {posts && posts.docs?.length > 0 && (
        <div className="row">
          {posts.docs.map((post) => (
            <div className="col-4">
              <PostCard post={post} linkToPostPage={true} />
            </div>
          ))}
        </div>
      )}
      <div className="row">
        <div
          role="button"
          onClick={() => {
            set_Page(_page - 1);
            setQueryPayload({ ...queryPayload, _page: _page - 1 });
          }}
          className="col-6"
        >
          Previous
        </div>
        <div
          role="button"
          onClick={() => {
            set_Page(_page + 1);
            setQueryPayload({ ...queryPayload, _page: _page + 1 });
          }}
          className="col-6"
        >
          Next
        </div>
      </div>
    </div>
  );
};
