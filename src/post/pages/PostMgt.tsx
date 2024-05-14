import { ChangeEvent, useEffect, useState } from "react";
import { ResponseMessage } from "../../generics/components/ResponseMessage";
import { Popover } from "../../generics/components/popover/Popover";
import { useGetPostsQuery } from "../contexts/post";
import { ComponentModal } from "../../generics/components/modals/ComponentModal";
import { CreateOrUpdatePost } from "./CreateAndUpdatePost";
import {
  GeneralSelect,
  ISelectOption,
} from "../../generics/components/form/Select";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import { useNavigate } from "react-router-dom";
import { getCategorys } from "../../category/contexts/category";
import { getClusters } from "../../cluster/contexts/cluster";
import { getFocalareas } from "../../focalarea/contexts/focalarea";
import { toast } from "react-toastify";
import { useThemeContextStore } from "../../generics/contexts/theme/theme";

export const PostMgt = () => {
  const navigate = useNavigate();
  const [postId, setPostId] = useState("create");
  const {tableThemeCssClass} = useThemeContextStore()
  const [queryPayload, setQueryPayload] = useState(
    {} as { [key: string]: string }
  );
  const [order, setOrder] = useState("-1");
  const [orderBy, setOrderBy] = useState("createdAt");
  const {setShowModalText} = useModalContextStore()
  const filterOptions: ISelectOption[] = [
    { label: "Published", value: "true" },
    { label: "Not Published", value: "false" },
  ];
  const orderOptions: ISelectOption[] = [
    { label: "DESC", value: "-1" },
    { label: "ASC", value: "1" },
  ];
  const orderByOptions: ISelectOption[] = [
    { label: "Date Created", value: "createdAt" },
    { label: "Last updated Date", value: "updatedAt" },
  ];

  const {setLoader} = useModalContextStore()
  const {
    data: posts,
    error,
    isLoading,
    isError,
  } = useGetPostsQuery({
    ...queryPayload,
    _orderBy: orderBy,
    _order: order,
  });

  isLoading ? setLoader({showLoader: true}) : setLoader({showLoader: false});
  

  const setUpModal = (postId: string) => {
    setPostId(postId);
    setShowModalText("create-post")
  };


  const searchBy = (searchTerm: string) => {
    if (searchTerm?.length < 3) return;
    setQueryPayload({_searchTerm: searchTerm });
  };

  const [categoryOptions, setCategoryOptions] = useState([] as ISelectOption[]);
  const [clusterOptions, setClusterOptions] = useState([] as ISelectOption[]);
  const [focalareaOptions, setFocalareaOptions] = useState([] as ISelectOption[]);
  
  useEffect(() => {
    getCategorys({})
    .then((res) => {
      setCategoryOptions(res.docs?.map((c) => ({label: c.categoryName, value: `${c._id}`})))
    })
    .catch((err) => console.error(err.message))
    getClusters({})
    .then((res) => {
      setClusterOptions(res.docs?.map((c) => ({label: c.clusterName, value: `${c._id}`})))
    })
    .catch((err) => console.error(err.message))
    getFocalareas({})
    .then((res) => {
      setFocalareaOptions(res.docs?.map((f) => ({label: f.focalareaName, value: `${f._id}`})))
    })
    .catch((err) => console.error(err.message))
    
  }, [])
  return (
    <div>
     

      <div className="row">
        <div className="col-sm-3">
          <input
            type="search"
            className="form-control"
            onChange={(e) => searchBy(e.target.value)}
            placeholder="search post by name, contact phone number, address"
            aria-label="search post"
          />
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/admin/post/post-mutate/create`)}
          >
            Create New
          </button>
        </div>

        {/* for filters */}
        <div className="col-sm-7 text-right">
          <div className="row">
            <div className="col-sm-2">
              <h1>{posts?.totalDocs} </h1>
              <small className="d-6">posts</small>
            </div>
            
            {/* filters by category cluster and focaalarea */}
            
            <div className="col-sm-5">
              <GeneralSelect
                selectOptions={categoryOptions}
                isMulti={false}
                handleChange={(option) =>
                  setQueryPayload({categorys: (option as ISelectOption).value})
                }
                label="Category"
              />
              <GeneralSelect
                selectOptions={clusterOptions}
                isMulti={false}
                handleChange={(option) =>
                  setQueryPayload({clusters: (option as ISelectOption).value})
                }
                label="Cluster"
              />
              <GeneralSelect
                selectOptions={focalareaOptions}
                isMulti={false}
                handleChange={(option) =>
                  setQueryPayload({focalareas: (option as ISelectOption).value})
                }
                label="Focal Area"
              />
            </div>
            <div className="col-sm-5">
              <GeneralSelect
                selectOptions={filterOptions}
                isMulti={false}
                handleChange={(option) =>
                  setQueryPayload({isPublished: (option as ISelectOption).value})
                }
                label="Publication status"
              />
              <GeneralSelect
                selectOptions={orderByOptions}
                isMulti={false}
                handleChange={(option) =>
                  setOrderBy((option as ISelectOption).value)
                }
                label="Order By"
              />
              <GeneralSelect
                selectOptions={orderOptions}
                isMulti={false}
                handleChange={(option) =>
                  setOrder((option as ISelectOption).value)
                }
                label="Sort (Descending or Ascending)"
              />
            </div>
          </div>
        </div>
        <div className="row my-4">
          <div className="col-sm-12">
            <table className={`table ${tableThemeCssClass} table-responsive table-tripped`}>
              <thead>
                <tr>
                  <th>Sn</th>

                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Last Managed By</th>
                  <th>Publication status</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {posts &&
                  posts?.docs?.length > 0 &&
                  posts?.docs.map((pst, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        {pst.media && (
                          <img src={pst.media.mediaUrl} className="img-avatar" />
                        )}
                      </td>
                      <td>{pst.title}</td>
                      <td>{(pst.user as any)?.firstName}</td>
                      <td>{pst.isPublished ? "published" : "Not published"}</td>
                      <td>
                        {
                          new Date((pst as any).createdAt)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td>
                        <i
                          className="btn fa fa-edit"
                          aria-label="open edit screen"
                          role="button"
                          onClick={() => navigate(`/admin/post/post-mutate/${pst._id}`)}
                        ></i>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {posts?.docs?.length && (
              <ul className="pagination">
                <li className="page-item">
                  <span
                    className="btn"
                    role="button"
                    onClick={() => {
                      setQueryPayload(
                        (prev) =>
                          ({ ...prev, _page: Number(posts.page) - 1 } as any)
                      );
                    }}
                  >
                    Previous
                  </span>
                </li>
                <li className="page-item">
                  <span
                    className="btn"
                    role="button"
                    onClick={() => {
                      setQueryPayload(
                        (prev) =>
                          ({ ...prev, _page: Number(posts.page) + 1 } as any)
                      );
                    }}
                  >
                    Next
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <ComponentModal
        modalBody={<CreateOrUpdatePost postId={postId} />}
        showModalText="create-post"
        modalTitle="Manage Post"
      />
    </div>
  );
};
