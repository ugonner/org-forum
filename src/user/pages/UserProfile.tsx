import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IUserDTO } from "../typings/user";

import { ITextInput } from "../../generics/components/form/TextInput";
import {
  ISelectOption,
  ISelectProp,
} from "../../generics/components/form/Select";
import { IDatePickerInputProp } from "../../generics/components/form/DatePicker";
import {
  defaultUserImageUrl,
  getUser,
  updateUser,
  updateUserAdmin,
} from "../contexts/api/user";
import { getClusters } from "../../cluster/contexts/cluster";
import { IClusterDTO } from "../../cluster/typings/cluster";
import { toast } from "react-toastify";
import {
  IFileAndObjectUrl,
  IMultipleFilesProps,
} from "../../generics/file/components/MultipleFiles";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";

export const UserProfile = () => {
  const navParam = useParams();
  const navigate = useNavigate();

  const {setLoader} = useModalContextStore()

  const userId = navParam.userId;
  const localUserString = localStorage.getItem("user");
  const localUser = localUserString ? JSON.parse(localUserString) : null;

  const [user, setUser] = useState({} as IUserDTO);
  const [pageMessage, setPageMessage] = useState(
    {} as { [key: string]: string }
  );

  const initGenderOptions: ISelectOption[] = [
    { label: "MAle", value: "M" },
    { label: "female", value: "F" },
  ];

  const [genderOptions, setGenderOptions] = useState({} as ISelectOption);
  const [clusterOptions, setClusterOptions] = useState([] as ISelectOption[]);
  const [selectedClusterOptions, setSelectedClusterOptions] = useState(
    [] as ISelectOption[]
  );
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[]);

  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };


  const [page, setPage] = useState(1);
  const [tabs, setTabs] = useState([
    {
      pageNumber: 1,
      label: "Dispalay Picture",
    },
    {
      pageNumber: 2,
      label: "Basic Info",
      iconClass: "fa fa-user"
    },

    {
      pageNumber: 3,
      label: "Bio Info",
      iconClass: "fa fa-vcard"
    },
    {
      pageNumber: 4,
      label: "Groups Info",
      iconClass: "fa fa-group"
    },
  ] as { pageNumber: number; label: string; iconClass: string; }[]);

  
  const [editProfile, setEditProfile] = useState(false);

  useEffect(() => {
    (async () => {
      try{
        setLoader({showLoader: true, loaderText: "loading user data, please wait"})
        const userRes = await getUser(`${userId}`);
        setLoader({showLoader: false, loaderText: ""})
        setUser(userRes);
      }catch(error){
        setLoader({showLoader: false, loaderText: ""})
      }
    })();
  }, []);

  return (
    <div className="row">
      <div className="col-2">
      {localUser &&
              `${localUser?.userId}` === `${userId}` && (
                <div className="text-right">
                  <span
                    className="d6 fa fa-edit"
                    role="button"
                    onClick={() => {
                      setEditProfile(true);
                      navigate(`/user/create/${user._id}`)
                    }}
                  ></span>
                </div>
              )}
        {tabs.map((tab, i) => (
          <div
            key={`div${i}`}
            className={`w-100 btn text-center ${
              page === tab.pageNumber
                ? "bg-light text-dark"
                : "bg-dark text-light"
            }`}
          >
            <div 
            className=""
            aria-label={tab.label}
            role="button"
            onClick={() => setPage(tab.pageNumber)}
            >
              
            {tab.pageNumber === 1 ? (
              <img
                src={user?.avatar}
                className="img-fluid img-responsive"
                alt="user"
              />
            ) : (
              <></>
            )}
            <span
              className={`d6 ${tab.iconClass}`}
            ></span>
            </div>
            
          </div>
        ))}
      </div>

      <div className="col-10">
        <div className="col-12">
          {page === 1 && (
            <div className="img-fluid">
              <img
                src={user.avatar ?? defaultUserImageUrl}
                alt="user"
                className="w-100 img-responsive"
              />
            </div>
          )}
          {page === 2 && (
            <div className="table-responsive">
              <table className="table table-striped table-dark">
                <tbody>
                  <tr>
                    <td>First Name</td>
                    <td className="font-weight-bold">{user.firstName}</td>
                  </tr>
                  <tr>
                    <td>Last Name</td>
                    <td className="font-weight-bold">{user.firstName}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {page === 3 && (
            <div className="table-responsive">
              <table className="table table-striped table-dark">
                <tbody>
                  <tr>
                    <td>Gender</td>
                    <td className="font-weight-bold">{user.gender}</td>
                  </tr>
                  <tr>
                    <td>Address</td>
                    <td className="font-weight-bold">{user.address}</td>
                  </tr>
                  <tr>
                    <td>Date Of Birth</td>
                    <td className="font-weight-bold">{user.dateOfBirth}</td>
                  </tr>

                  <tr>
                    <td>Phone Number</td>
                    <td className="font-weight-bold">{user.phoneNumber}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          {page === 4 && (
            <div className="table table-responsive table-stripped table-dark">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Cluster</th>
                  </tr>
                </thead>
                <tbody>
                  {user.clusters &&
                    user.clusters.map((c, i) => (
                      <tr key={i}>
                        <td className="btn" role="button" onClick={() => navigate(`/cluster/view/${(c as IClusterDTO)._id}`)}>{(c as IClusterDTO).clusterName}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          

        </div>

      </div>
    </div>
  );
};
