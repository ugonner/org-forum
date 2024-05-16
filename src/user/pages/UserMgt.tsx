import { ChangeEvent, useEffect, useState } from "react";
import { ResponseMessage } from "../../generics/components/ResponseMessage";
import { Popover } from "../../generics/components/popover/Popover";
import { getUsers, updateUserAdmin, useGetUsersQuery } from "../contexts/api/user";
import { ComponentModal } from "../../generics/components/modals/ComponentModal";
import { CreateOrUpdateUser } from "./CreateAndUpdateUser";
import {
  GeneralSelect,
  ISelectOption,
} from "../../generics/components/form/Select";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import { getPostsCount } from "../../post/contexts/post";
import { getCategorys } from "../../category/contexts/category";
import { getClusters } from "../../cluster/contexts/cluster";
import { getFocalareas } from "../../focalarea/contexts/focalarea";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AssignCluster } from "./AssignCluster";
import { IUserDTO } from "../typings/user";
import { MessageUsers } from "./Message";
import { AssignPosition } from "./AssignPosition";
import { AssignRole } from "./AssignRoles";
import { useThemeContextStore } from "../../generics/contexts/theme/theme";
import { IGenericResponse } from "../../generics/typings/typngs";
import { LoaderModal } from "../../generics/components/modals/LoaderModal";

export const UserMgt = () => {
  const navigate = useNavigate();
  const {setShowModalText} = useModalContextStore()
  const {tableThemeCssClass} = useThemeContextStore()
  const [userId, setUserId] = useState("create");
  const [user, setUser] = useState({} as IUserDTO);
  const [queryPayload, setQueryPayload] = useState(
    {} as { [key: string]: string }
  );
  const [order, setOrder] = useState("-1");
  const [orderBy, setOrderBy] = useState("createdAt");

  const {setLoader} = useModalContextStore()
  
  const filterOptions: ISelectOption[] = [
    { label: "Published", value: "isPublished" },
  ];
  const orderOptions: ISelectOption[] = [
    { label: "DESC", value: "-1" },
    { label: "ASC", value: "1" },
  ];
  const orderByOptions: ISelectOption[] = [
    { label: "Date Created", value: "createdAt" },
    { label: "Last updated Date", value: "updatedAt" },
  ];

  const {
    data: users,
    error,
    isLoading,
    isError,
  } = useGetUsersQuery({
    ...queryPayload,
    _orderBy: orderBy,
    _order: order,
  });

  

  if(isError){
    toast.error((error as IGenericResponse<unknown>).message)
  }
  
  


  const setUpModal = (config: {modalName: string; userId: string; user?: IUserDTO;}) => {
    if(config.user){
      setUser(config.user as IUserDTO)
    }
    setUserId(`${config.userId}`);
    setShowModalText(`${config.modalName}${config.userId}`)
    
  };

  const filterUsers = (payload: ISelectOption[]) => {
    const queryObj: { [key: string]: string } = {};
    payload.forEach((p) => {
      queryObj[p.label] = p.value;
    });
    setQueryPayload(queryObj);
  };

  const searchBy = (searchTerm: string) => {
    if (searchTerm?.length < 3) return;
    setQueryPayload({ _searchBy: searchTerm });
  };



  const [clusterOptions, setClusterOptions] = useState([] as ISelectOption[]);
  const statusOptions: ISelectOption[] = [
    {label: "active", value: "active"}, {label: "inactive", value: "inactive"}
  ]
  useEffect(() => {
    getClusters({})
    .then((res) => {
      setClusterOptions(res.docs?.map((c) => ({label: c.clusterName, value: `${c._id}`})))
    })
    .catch((err) => console.error(err.message))
   
  }, [])

  const updateUserStatus = async (userProperty: string, value: unknown) => {
    try{
      setLoader({showLoader: true, loaderText: "updating user"})
      await updateUserAdmin({[userProperty]: value, userId} as any)
      setLoader({showLoader: false, loaderText: ""})
    }catch(error){
      setLoader({showLoader: false, loaderText: ""})
      toast.error((error as any).message)
    }
  } 
  
  if(isLoading ) return (<LoaderModal />)
  return (
    <div>

      <div className="row">
        <div className="col-sm-3">
          <input
            type="search"
            className="form-control"
            onChange={(e) => searchBy(e.target.value)}
            placeholder="search user by name, contact phone number, address"
            aria-label="search user"
          />
          
        </div>
        <div className="col-sm-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/auth/register")}
          >
            Create New
          </button>
        </div>
        {/* for filters */}
        <div className="col-sm-7 text-right">
          <div className="row">
            <div className="col-sm-2">
              <h1>{users?.totalDocs} </h1>
              <small className="d-6">users</small>
            </div>
            
            {/* filters by category cluster and focaalarea */}
            
            <div className="col-sm-5">
              <GeneralSelect
                selectOptions={clusterOptions}
                isMulti={false}
                handleChange={(option) =>
                  setQueryPayload({clusters: (option as ISelectOption).value})
                }
                label="Cluster"
              />
              <GeneralSelect
                selectOptions={statusOptions}
                isMulti={false}
                handleChange={(option) =>
                  setQueryPayload({status: (option as ISelectOption).value})
                }
                label="user status"
              />
            </div>
            <div className="col-sm-5">
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
            <table className={`table table-responsive ${tableThemeCssClass} table-tripped`}>
              <thead>
                <tr>
                  <th>Sn</th>

                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>User Verification status</th>
                  <th>Clusters</th>
                  <th>Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users?.docs?.length > 0 &&
                  users?.docs.map((u, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        {u.avatar && (
                          <img src={u.avatar} className="img-avatar" alt="" />
                        )}
                      </td>
                      <td>{`${u.firstName}, ${u.lastName}` }</td>
                      <td>{u.phoneNumber ?? "" }</td>
                      <td>{u.emailVerified ? (<i className="fas fas-check"></i>) : (<i className="fas fas-times"></i>) }</td>
                      <td>{u.clusters?.length ?? " "}</td>
                      <td>
                        {
                          new Date((u as any).createdAt)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td>
                        <Popover
                        buttons={[
                          {buttonText: "Edit", handler: () => setUpModal({modalName: "editUserModal", userId: `${u._id}`, user: u})},
                          {buttonText: "Manage Cluster(s)", handler: () => setUpModal({modalName: "manageUserClusterModal", userId: `${u._id}`,  user: u})},
                          {buttonText: "Manage Position", handler: () => setUpModal({modalName: "manageUserPositionModal", userId: `${u._id}`,  user: u})},
                          {buttonText: "Manage Role(s)", handler: () => setUpModal({modalName: "manageUserRolesModal", userId: `${u._id}`,  user: u})},
                          {buttonText: (u.emailVerified ? "verify user" : "undo verification"), handler: () => updateUserStatus("emailVerified", (u.emailVerified ? false : true))},
                        ]}
                        showPopoverId={`user${u._id}`}
                        ariaLabel="show more actions"
                        displayElement={(<i className="fa fa-gears"></i> )}
                        />
                        {/* <i
                          className="btn fa fa-create"
                          aria-label="open edit screen"
                          role="button"
                          onClick={() => setUpModal(`${u._id}`)}
                        ></i> */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {users?.docs?.length && (
              <ul className="pagination">
                <li className="page-item">
                  <span
                    className="btn"
                    role="button"
                    onClick={() => {
                      setQueryPayload(
                        (prev) =>
                          ({ ...prev, _page: Number(users.page) - 1 } as any)
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
                          ({ ...prev, _page: Number(users.page) + 1 } as any)
                      );
                    }}
                  >
                    Next
                  </span>
                </li>
                <li className="page-item">
                  <span
                    className="btn"
                    role="button"
                    onClick={() => setUpModal({modalName: "sendMessageModal", userId})}
                  >
                    Message This Group Of Users
                  </span>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

<ComponentModal
  modalBody={<CreateOrUpdateUser userId={userId} />}
  showModalText={`editUserModal${userId}`}
  modalTitle="Manage User"
  
/>

<ComponentModal
  modalBody={<AssignCluster user={user} />}
  showModalText={`manageUserClusterModal${userId}`}
  modalTitle="Manage User Clusters"
  
/>
<ComponentModal
  modalBody={<AssignPosition user={user} />}
  showModalText={`manageUserPositionModal${userId}`}
  modalTitle="Manage User Position"
  
/>


<ComponentModal
  modalBody={<AssignRole user={user} />}
  showModalText={`manageUserRolesModal${userId}`}
  modalTitle="Manage User Roles / Permissions"
  
/>
<ComponentModal
  modalBody={<MessageUsers usersQueryPayload={queryPayload} />}
  showModalText={`sendMessageModal${userId}`}
  modalTitle="Send Message To Users"
  
/>
    </div>
  );
};
