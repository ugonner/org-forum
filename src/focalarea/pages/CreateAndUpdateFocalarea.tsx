import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IFocalareaDTO } from "../typings/focalarea";
import {
  IResponseMessageProp,
  ResponseMessage,
} from "../../generics/components/ResponseMessage";
import { createFocalarea, getFocalarea, updateFocalarea, useGetFocalareaQuery } from "../contexts/focalarea";
import { TextInput } from "../../generics/components/form/TextInput";
import { IFileAndObjectUrl } from "../../generics/file/components/MultipleFiles";
import { deleteFile, selectMultipleFiles, uploadFiles } from "../../generics/file/utils/filehooks";
import { MultipleFiles } from "../../generics/file/components/MultipleFiles";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import { toast } from "react-toastify";
import { IGenericResponse } from "../../generics/typings/typngs";
import { error } from "console";

interface ICreateFocalareaProp {
  focalareaId: string | "create"
}
export const CreateOrUpdateFocalarea = (prop: ICreateFocalareaProp) => {
  const viewPurpose: "Create" | "Edit" = /create/i.test(`${prop.focalareaId}`) ? "Create" : "Edit";

  const [focalareaData, setFocalareaData] = useState({} as IFocalareaDTO);
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[])
  const [responseData, setResponseData] = useState({} as IResponseMessageProp);
  const {setLoader} = useModalContextStore()
  //let initialData: IFocalareaDTO = {} as IFocalareaDTO;
useEffect(() => {
  ( async () => {
    try{
      setLoader({showLoader: true, loaderText: "loading data"})
      const focalareaId = prop.focalareaId
      if(viewPurpose === "Edit" && focalareaId){
        const res = await getFocalarea(focalareaId)
        setFocalareaData(res);
      }
      setLoader({showLoader: false, loaderText: ""})
    }catch(error){
      setLoader({showLoader: false, loaderText: ""})
      toast.error((error as IGenericResponse<unknown>).message);
      console.log("Error fetching initial data", error)
    }
  })()
}, [])
  const inputFields: IFocalareaDTO = {
    focalareaName: "",
    detail: "",
  };


  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFocalareaData({ ...focalareaData, [name]: value });
  }

  //Dispatch<SetStateAction<IFileAndObjectUrl[]>>>
  async function createNewFocalarea(e: FormEvent<HTMLFormElement>, selectedFiles: IFileAndObjectUrl[]): Promise<null> {
    try {
      setLoader({showLoader: true, loaderText: "saving"})
      
      const uploadfilesRes = await uploadFiles(e, selectedFiles)
      if(uploadfilesRes && Array.isArray(uploadfilesRes)){
        focalareaData.avatar = uploadfilesRes[0].url
      }
      const res = viewPurpose === "Edit" ? await updateFocalarea({...focalareaData, focalareaId: (prop.focalareaId as string)}) : await createFocalarea(focalareaData);
      
      setLoader({showLoader: false, loaderText: ""})
      return null;
    } catch (error) {
      setLoader({showLoader: false, loaderText: ""})
      toast.error((error as IGenericResponse<unknown>).message);
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
                  /^detail/i.test(field) || /^focalareaName/i.test(field)
                    ? true
                    : false
                }
                placeHolder={field}
                cssClass=""
                handleChange={handleChange}
                value={(focalareaData as any)[field]}
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
            uploadFiles={createNewFocalarea}
            selectMultipleFiles={selectMultipleFiles}
            />
        </div>
      </div>
    </div>
  );
};
