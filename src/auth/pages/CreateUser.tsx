import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IUserDTO } from "../../user/typings/user";
import {
  FormDisplay,
  IInputFieldWithPageNumber,
} from "../../generics/components/form/FormDisplay";
import { ITextInput } from "../../generics/components/form/TextInput";
import {
  ISelectOption,
  ISelectProp,
} from "../../generics/components/form/Select";
import { IDatePickerInputProp } from "../../generics/components/form/DatePicker";
import { getUser, updateUser, updateUserAdmin } from "../../user/contexts/api/user";
import { getClusters } from "../../cluster/contexts/cluster";
import { IClusterDTO } from "../../cluster/typings/cluster";
import { toast } from "react-toastify";
import { IFileAndObjectUrl, IMultipleFilesProps } from "../../generics/file/components/MultipleFiles";
import { deleteFile, selectMultipleFiles, uploadFiles } from "../../generics/file/utils/filehooks";
import { createUser } from "../contexts/auth";
import { ICreateUser } from "../typings/auth";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import { IGenericResponse } from "../../generics/typings/typngs";

export const CreateUserInStages = () => {
  const navParam = useParams();
  const userId = navParam.userId;

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
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[])
  useEffect(() => {
    (
      async () => {
        try{
          
        
      setLoader({showLoader: true, loaderText: "loading user data"})
      const userRes = await getUser(`${userId}`);
      setUser(userRes);

      
    setLoader({showLoader: true, loaderText: "loading clusters / groups"})
      const clustersRes = await getClusters({});
      
      const selectOptions: ISelectOption[] = [];
      const allOptions: ISelectOption[] = [];
      clustersRes.docs.forEach((c) => {
        const cOption: ISelectOption = {label: c.clusterName, value: `${c._id}`};
        allOptions.push(cOption);
        const isSelected = (userRes?.clusters as IClusterDTO[])?.find((uc) => c._id === (uc._id ?? uc))
        if(isSelected){
          selectOptions.push(cOption)
        }
      })
      setClusterOptions(allOptions);
      setSelectedClusterOptions(selectOptions);
        }catch(error){
          setLoader({showLoader: false, loaderText: ""});
          toast.error((error as IGenericResponse<unknown>).message);
          
        }
      }
    )()
  }, []);

  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const userInputFields: IInputFieldWithPageNumber[] = [
    {
      pageNumber: 1,
      inputType: "email",
      inputProp: {
        inputLabel: "email",
        inputName: "email",
        inputType: "email",
        required: true,
        value: user.email,
        placeholder: "email",
        cssClass: "",
        handleChange: handleTextInputChange,
      } as ITextInput,
    },
    {
      pageNumber: 1,
      inputType: "password",
      inputProp: {
        inputLabel: "password",
        inputName: "password",
        inputType: "password",
        required: true,
        value: user.password,
        cssClass: "",
        handleChange: handleTextInputChange,
      } as ITextInput,
    },
    {
      pageNumber: 1,
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
      pageNumber: 1,
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
      pageNumber: 2,
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
      pageNumber: 2,
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
      pageNumber: 2,
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
      pageNumber: 2,
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
      pageNumber: 3,
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


    {
      pageNumber: 3,
      inputType: "text",
      inputProp: {
        inputLabel: "Brief about your self",
        inputName: "about",
        inputType: "text",
        required: false,
        value: user.about,
        placeholder: "This is  me",
        cssClass: "",
        handleChange: handleTextInputChange,
      } as ITextInput,
    },
    {
      pageNumber: 4,
      inputType: "file",
      inputProp: {
        selectedFiles,
        setSelectedFiles,
        selectMultipleFiles: selectMultipleFiles,
        deleteFile: deleteFile,
        hideSubmitButton: true,
        fileInputAccept: "image/*",
        fileLabelText: "upload profile image",
        fileInputId: "user-profile-image"
      } as IMultipleFilesProps,
    },
  ];

  const [page, setPage] = useState(1);

  const {setLoader} = useModalContextStore();
  const submitUser = async () => {
    try{

      setLoader({showLoader: true, loaderText: "uploading"})

      const res = await uploadFiles({} as any, selectedFiles);
      if(res?.length){
        user.avatar = res[0].secureUrl; 
      }
      //handle populated clusters values
      if((user.clusters as IClusterDTO[])[0]?._id){
        user.clusters = (user.clusters as IClusterDTO[]).map((cluster) => `${cluster._id}`)
      }
      setLoader({showLoader: true, loaderText: "saving"})

      if(userId && !/create/i.test(userId)){
        await updateUserAdmin({...user, userId});
      }else {
        await createUser(user as ICreateUser)
      }

      setLoader({showLoader: false, loaderText: ""})

    }catch(error){
      setLoader({showLoader: false, loaderText: ""})
      toast.error((error as any).message)
    }
  } 
  const [message, setMessage] = useState("");
  return (
    <div className="row">
      <div className="col-12">
        {page === 1 && (
          <FormDisplay
            inputFields={userInputFields.filter((f) => f.pageNumber === 1)}
            pageLayoutColumns={2}
            pageMessage={pageMessage}
            pageNumber={1}
          />
        )}

        {page === 2 && (
          <FormDisplay
            inputFields={userInputFields.filter((f) => f.pageNumber === 2)}
            pageLayoutColumns={2}
            pageMessage={pageMessage}
            pageNumber={2}
          />
        )}

        {page === 3 && (
          <FormDisplay
            inputFields={userInputFields.filter((f) => f.pageNumber === 3)}
            pageLayoutColumns={2}
            pageMessage={pageMessage}
            pageNumber={3}
          />
        )}
        {page === 4 && (
          <FormDisplay
            inputFields={userInputFields.filter((f) => f.pageNumber === 4)}
            pageLayoutColumns={2}
            pageMessage={pageMessage}
            pageNumber={4}
          />
        )}
      </div>
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
            alert(JSON.stringify(selectedFiles))
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
    </div>
  );
};
