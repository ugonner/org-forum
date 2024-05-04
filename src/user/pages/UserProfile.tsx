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
import {
  deleteFile,
  selectMultipleFiles,
  uploadFiles,
} from "../../generics/file/utils/filehooks";
import { createUser } from "../../auth/contexts/auth";
import { ICreateUser } from "../../auth/typings/auth";
import {
  FormDisplay,
  IInputFieldWithPageNumber,
} from "../../generics/components/form/FormDisplay";

export const UserProfile = () => {
  const navParam = useParams();
  const navigate = useNavigate();
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

  const userInputFields: IInputFieldWithPageNumber[] = [
    {
      pageNumber: 5,
      inputType: "file",
      inputProp: {
        selectedFiles,
        setSelectedFiles,
        selectMultipleFiles: selectMultipleFiles,
        deleteFile: deleteFile,
        hideSubmitButton: true,
        fileInputAccept: "image/*",
        fileLabelText: "upload profile image",
        fileInputId: "user-profile-image",
      } as IMultipleFilesProps,
    },
    {
      pageNumber: 6,
      inputType: "text",
      inputProp: {
        inputLabel: "firstName",
        inputName: "firstName",
        inputType: "text",
        required: true,
        value: user.firstName,
        placeholder: "firstName",
        cssClass: "",
        handleChange: handleTextInputChange,
      } as ITextInput,
    },

    {
      pageNumber: 6,
      inputType: "text",
      inputProp: {
        inputLabel: "lastName",
        inputName: "lastName",
        inputType: "text",
        required: true,
        value: user.lastName,
        placeholder: "lastName",
        cssClass: "",
        handleChange: handleTextInputChange,
      } as ITextInput,
    },

    {
      pageNumber: 7,
      inputType: "tel",
      inputProp: {
        inputLabel: "phoneNumber",
        inputName: "phoneNumber",
        inputType: "text",
        required: true,
        value: user.phoneNumber,
        placeholder: "phoneNumber",
        cssClass: "",
        handleChange: handleTextInputChange,
      } as ITextInput,
    },

    {
      pageNumber: 7,
      inputType: "text",
      inputProp: {
        inputLabel: "address",
        inputName: "address",
        inputType: "text",
        required: true,
        value: user.address,
        placeholder: "address",
        cssClass: "",
        handleChange: handleTextInputChange,
      } as ITextInput,
    },
    {
      pageNumber: 7,
      inputType: "select",
      inputProp: {
        selectOptions: initGenderOptions,
        isMulti: false,
        handleChange: (option: ISelectOption) => {
          //setGenderOptions(option)
          setUser({ ...user, gender: option.value });
        },
        label: "gender",
        uniqueId: "gender",
      } as ISelectProp,
    },

    {
      pageNumber: 7,
      inputType: "date",
      inputProp: {
        selectedDate: new Date(),
        handleChange: (date: Date) => {
          const dateValue = new Date(date.getTime())
            .toISOString()
            .split("T")[0];
          setUser({ ...user, dateOfBirth: dateValue });
        },
        label: "Date Of Birth",
        uniqueId: "dateOfBirth",
      } as IDatePickerInputProp,
    },

    {
      pageNumber: 8,
      inputType: "select",
      inputProp: {
        selectOptions: clusterOptions,
        isMulti: true,
        handleChange: (options: ISelectOption[]) => {
          setSelectedClusterOptions([...options]);
          setUser({
            ...user,
            clusters: options.map((opt) => opt.value) as string[],
          });
        },
        value: selectedClusterOptions,
        label: "Disability Clusters",
        uniqueId: "clusters",
      } as ISelectProp,
    },
  ];

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
  const editTabs: { pageNumber: number; label: string; iconClass: string; }[] = [
    {
      pageNumber: 5,
      label: "Edit Basic",
      iconClass: "fa fa-user"
    },
    {
      pageNumber: 6,
      label: "Edit Bio",
      iconClass: "fa fa-vcard"
    },
    {
      pageNumber: 7,
      label: "Edit Groups",
      iconClass: "fa fa-users"
    },
    {
      pageNumber: 8,
      label: "Edit DP",
      iconClass: "fa fa-file-image"
    },
  ];

  const submitUser = async () => {
    try {
      const res = await uploadFiles({} as any, selectedFiles);
      if (res?.length) {
        user.avatar = res[0].secureUrl;
      }
      if (userId && !/create/i.test(userId)) {
        await updateUserAdmin({ ...user, userId });
      } else {
        await createUser(user as ICreateUser);
      }
    } catch (error) {
      toast.error((error as any).message);
    }
  };
  const [message, setMessage] = useState("");

  const [editProfile, setEditProfile] = useState(false);

  useEffect(() => {
    (async () => {
      const userRes = await getUser(`${userId}`);
      setUser(userRes);
      //(localUser && `${localUser?.userId}` === `${userId}` ) && setTabs([...tabs, ...editTabs]);
      const clustersRes = await getClusters({});

      const selectOptions: ISelectOption[] = [];
      const allOptions: ISelectOption[] = [];
      clustersRes.docs.forEach((c) => {
        const cOption: ISelectOption = {
          label: c.clusterName,
          value: `${c._id}`,
        };
        const isSelected = (userRes?.clusters as IClusterDTO[])?.find(
          (uc) => c._id === (uc._id ?? uc)
        );
        if (isSelected) {
          selectOptions.push(cOption);
        }
      });
      setClusterOptions(allOptions);
      setSelectedClusterOptions(selectOptions);
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
              
            {tab.pageNumber === 1 || tab.pageNumber === 5 ? (
              <img
                src={user?.avatar}
                className="img-fluid img-responsive"
                alt="user"
              />
            ) : (
              <span className="d1">{tab.pageNumber}</span>
            )}
            <br />
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
          {editProfile && page === 5 && (
            <div className="row">
              <div className="col-sm-3">
                <img
                  src={user?.avatar ?? defaultUserImageUrl}
                  alt="user"
                  className="img-fluid"
                />
              </div>
              <div className="col-sm-9">
                <FormDisplay
                  inputFields={userInputFields.filter(
                    (f) => f.pageNumber === 5
                  )}
                  pageLayoutColumns={2}
                  pageMessage={pageMessage}
                  pageNumber={1}
                />
              </div>
            </div>
          )}

          {editProfile && page === 6 && (
            <FormDisplay
              inputFields={userInputFields.filter((f) => f.pageNumber === 6)}
              pageLayoutColumns={2}
              pageMessage={pageMessage}
              pageNumber={2}
            />
          )}

          {editProfile && page === 7 && (
            <FormDisplay
              inputFields={userInputFields.filter((f) => f.pageNumber === 7)}
              pageLayoutColumns={2}
              pageMessage={pageMessage}
              pageNumber={3}
            />
          )}

          {editProfile && page === 8 && (
            <FormDisplay
              inputFields={userInputFields.filter((f) => f.pageNumber === 8)}
              pageLayoutColumns={2}
              pageMessage={pageMessage}
              pageNumber={3}
            />
          )}
        </div>

        {page > 4 && (
          <div className="row">
            <div className="col-4">
              <button
                className="w-100 btn btn-primary"
                onClick={() => setPage(page === 1 ? 1 : page - 1)}
              >
                {page === 1 ? "start" : "Previos"}
              </button>
            </div>
            <div className="col-4">
              <button
                className="w-100 btn"
                onClick={() => {
                  submitUser();
                }}
              >
                save
              </button>
            </div>
            <div className="col-4">
              <button
                className="w-100 btn btn-primary"
                onClick={() => setPage(page + 1)}
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
