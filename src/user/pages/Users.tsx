import { useEffect, useState } from "react"
import { IGenericResponse, QueryReturn } from "../../generics/typings/typngs"
import { IUserDTO } from "../typings/user"
import { User } from "./User"
import { getUsers, useGetUsersQuery } from "../contexts/api/user"
import { useLocation } from "react-router-dom"
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider"
import { toast } from "react-toastify"

export const Users = () => {
    const { search } = useLocation();
  
    const buildSearchObj = (): {[key: string]: string | number} => {
        const searchArr = search.slice(1).split("&");
        const searchObj: {[key: string]: string | number} = {};
        searchArr.forEach((s) => {
            const [key, value] = s.split("=");
            searchObj[key] = value;
        })
        return searchObj;
    }

    const [_page, set_Page] = useState(1);
    const searchQuery = buildSearchObj();
    const [queryPayload, setQueryPayload] = useState({...searchQuery, _page, _orderBy: "createdAt", _order: "DESC"} as {[key: string]: string | number})
    //const {data: users, error} = useGetUsersQuery(queryPayload);
    const [users, setUsers] = useState({} as QueryReturn<IUserDTO>)
    const {setLoader} = useModalContextStore()
    useEffect(() => {
        (
            async () => {
                try{
                    setLoader({showLoader: true, loaderText: "fetching users, please wait"});

                    const usersRes = await getUsers(queryPayload);
                    setUsers(usersRes);
                    setLoader({showLoader: false, loaderText: ""})
                }catch(error){
                    setLoader({showLoader: false, loaderText: ""})
                    toast.error((error as IGenericResponse<unknown>).message)
                }
            }
        )()
    }, [queryPayload])

    return (
        <div className="row">
        <div className="col-4">
            <input 
            className="form-control"
            aria-label="search users"
            placeholder="search users"
            onChange={(e) => {
                if(e.target.value.length < 3) return;
                setQueryPayload({_searchBy: e.target.value, _orderBy: "firstName", _order: "DESC", _page})
            }}
            />
        </div>
            <div className="col-4">
                <h1>Users | {users?.totalDocs}</h1>
            </div>
            <div className="col-4"></div>
                {
                    users && users.docs?.length > 0 && (
                        <div className="row">
                            {
                                users.docs.map((user) => (
                                   <div className="col-4">
                                     <User user={user} />
                                   </div>
                                ))
                            }
                        </div>
                    )
                }
                <div className="row">
                <div 
                    role="button"
                    onClick={() => {
                        set_Page((_page - 1))
                        setQueryPayload({...queryPayload, _page: (_page - 1)})
                    }}
                    className="col-6"
                    >
                        Previous

                    </div>
                    <div 
                    role="button"
                    onClick={() => {
                        set_Page((_page + 1))
                        setQueryPayload({...queryPayload, _page: (_page + 1)})
                    }}
                    className="col-6"
                    >
                        Next

                    </div>
                </div>
        </div>
    )
}