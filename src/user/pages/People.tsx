import { useNavigate } from "react-router-dom";
import {
  IGetEntitiesFromModelArrayPropertyDTO,
  IUserDTO,
} from "../typings/user";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { QueryReturn } from "../../generics/typings/typngs";
import { getUsersFromEntityGroupProperty } from "../contexts/api/user";
import { camelCaseNameFormatter } from "../../generics/utils/camelCaseNameFormatter";
import { User } from "./User";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";

export interface IPeopleFromEntityProp
  extends IGetEntitiesFromModelArrayPropertyDTO {}
export const PeopleFromEntity = (prop: IPeopleFromEntityProp) => {
  const navigate = useNavigate();
  const [queryPayload, setQueryPayload] = useState(
    prop as IGetEntitiesFromModelArrayPropertyDTO
  );
  const [users, setUsers] = useState({} as QueryReturn<IUserDTO>);
  const [_page, set_Page] = useState(1);

  const {setLoader} = useModalContextStore()
  useEffect(() => {
    (async () => {
      try {
        setLoader({showLoader: true, loaderText: "loading users"});
        const usersRes = await getUsersFromEntityGroupProperty(queryPayload);
        setUsers(usersRes);
        setLoader({showLoader: false, loaderText: ""})
      } catch (error) {
        setLoader({showLoader: false, loaderText: ""})
        toast.error((error as any).message);
      }
    })();
  }, [queryPayload]);

  return (
    <div className="row">
      <div className="row">
        <div className="col-4"></div>
        <div className="col-4">
          <h1 className="text-capitalize">
            {" "}
            {camelCaseNameFormatter(queryPayload.arrayPropertyName)} |{" "}
            {users.totalDocs}
          </h1>
        </div>
        <div className="col-4"></div>
      </div>
      <div className="row">
        {users.docs?.length > 0 &&
          users.docs.map((user, i) => (
            <div key={i} className="col-sm-6">
              <User user={user} />
            </div>
          ))}
      </div>
      <div className="row">
        <div 
        className="col-6"
        role="button"
        onClick={() => {
            set_Page(_page - 1);
            setQueryPayload({...queryPayload, _page: (_page - 1)})
        }}
        >
            Previousk
        </div>
        <div 
        className="col-6"
        role="button"
        onClick={() => {
            set_Page(_page + 1);
            setQueryPayload({...queryPayload, _page: (_page + 1)})
        }}
        >
            Next
        </div>
      </div>
    </div>
  );
};
