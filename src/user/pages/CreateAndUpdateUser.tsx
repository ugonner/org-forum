import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IUserDTO } from "../typings/user";
import {
  IResponseMessageProp,
  ResponseMessage,
} from "../../generics/components/ResponseMessage";
import { createUser, getUser, updateUser, updateUserAdmin, useGetUserQuery } from "../contexts/api/user";
import { TextInput } from "../../generics/components/form/TextInput";
import { IFileAndObjectUrl } from "../../generics/file/components/MultipleFiles";
import { deleteFile, selectMultipleFiles, uploadFiles } from "../../generics/file/utils/filehooks";
import { MultipleFiles } from "../../generics/file/components/MultipleFiles";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import { toast } from "react-toastify";
import { IGenericResponse } from "../../generics/typings/typngs";

interface ICreateUserProp {
  userId: string | "create"
}
export const CreateOrUpdateUser = (prop: ICreateUserProp) => {
  const viewPurpose: "Create" | "Edit" = /create/i.test(`${prop.userId}`) ? "Create" : "Edit";

  const [userData, setUserData] = useState({} as IUserDTO);
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[])
  const [responseData, setResponseData] = useState({} as IResponseMessageProp);
  const {setLoader} = useModalContextStore()
  //let initialData: IUserDTO = {} as IUserDTO;
useEffect(() => {
  ( async () => {
    try{
      const userId = prop.userId
      if(viewPurpose === "Edit" && userId){
        
        setLoader({showLoader: true, loaderText: "loading user data"})
        const res = await getUser(userId)
        setUserData(res);
      }
      
      setLoader({showLoader: false, loaderText: ""})
    }catch(error){
      setLoader({showLoader: false, loaderText: ""})
      console.log("Error fetching initial data", error)
    }
  })()
}, [])
  const inputFields: IUserDTO = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    address: "",
    dateOfBirth: ""
  };


  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  }

  //Dispatch<SetStateAction<IFileAndObjectUrl[]>>>
  async function createNewUser(e: FormEvent<HTMLFormElement>, selectedFiles: IFileAndObjectUrl[]): Promise<null> {
    try {
      
      setLoader({showLoader: true, loaderText: "checking and uploading"})
      const uploadfilesRes = await uploadFiles(e, selectedFiles)
      if(uploadfilesRes && Array.isArray(uploadfilesRes)){
        userData.avatar = uploadfilesRes[0].url
      }
      setLoader({showLoader: true, loaderText: "updating user"})
      const res = viewPurpose === "Edit" ? await updateUserAdmin({...userData, userId: (prop.userId as string)}) : await createUser(userData);
      
      setLoader({showLoader: false, loaderText: ""})
      return null;
    } catch (err) {
      setLoader({showLoader: false, loaderText: ""});
      toast.error((err as IGenericResponse<unknown>).message)
      return null;
    }
  }
  
  return (
    <div className="form-group">
      <div>
        <div>
          {Object.keys(inputFields).map((field, i) => {
            return  (
              <div key={i}>
              <TextInput
                inputName={field}
                inputLabel={field}
                required={
                  /^detail/i.test(field) || /^userName/i.test(field)
                    ? true
                    : false
                }
                placeHolder={field}
                cssClass=""
                handleChange={handleChange}
                value={(userData as any)[field]}
              />
              </div>
            )
          })}
        </div>
        <div className="form-group">
            <label htmlFor=""> You can pick an avatar </label>
            <MultipleFiles
            selectedFiles={selectedFiles}
            deleteFile={deleteFile}
            setSelectedFiles={setSelectedFiles}
            uploadFiles={createNewUser}
            selectMultipleFiles={selectMultipleFiles}
            />
        </div>
      </div>
    </div>
  );
};
