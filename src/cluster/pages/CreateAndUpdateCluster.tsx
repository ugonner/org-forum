import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IClusterDTO } from "../typings/cluster";
import {
  IResponseMessageProp,
  ResponseMessage,
} from "../../generics/components/ResponseMessage";
import { createCluster, getCluster, updateCluster, useGetClusterQuery } from "../contexts/cluster";
import { TextInput } from "../../generics/components/form/TextInput";
import { IFileAndObjectUrl } from "../../generics/file/components/MultipleFiles";
import { deleteFile, selectMultipleFiles, uploadFiles } from "../../generics/file/utils/filehooks";
import { MultipleFiles } from "../../generics/file/components/MultipleFiles";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import { toast } from "react-toastify";
import { IGenericResponse } from "../../generics/typings/typngs";

interface ICreateClusterProp {
  clusterId: string | "create"
}
export const CreateOrUpdateCluster = (prop: ICreateClusterProp) => {
  const viewPurpose: "Create" | "Edit" = /create/i.test(`${prop.clusterId}`) ? "Create" : "Edit";

  const [clusterData, setClusterData] = useState({} as IClusterDTO);
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[])
  const [responseData, setResponseData] = useState({} as IResponseMessageProp);
  const {setLoader} = useModalContextStore()
  //let initialData: IClusterDTO = {} as IClusterDTO;
useEffect(() => {
  ( async () => {
    try{
      setLoader({showLoader: true, loaderText: "loading data"})
      const clusterId = prop.clusterId
      if(viewPurpose === "Edit" && clusterId){
        const res = await getCluster(clusterId)
        setClusterData(res);
      }
      setLoader({showLoader: false, loaderText: ""})
    }catch(error){
      setLoader({showLoader: false, loaderText: ""})
      toast.error((error as IGenericResponse<unknown>).message)
      console.log("Error fetching initial data", error)
    }
  })()
}, [])
  const inputFields: IClusterDTO = {
    clusterName: "",
    detail: "",
    contactEmail: "",
    contactPhoneNumber: "",
    contactAddress: "",
  };


  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setClusterData({ ...clusterData, [name]: value });
  }

  
  //Dispatch<SetStateAction<IFileAndObjectUrl[]>>>
  async function createNewCluster(e: FormEvent<HTMLFormElement>, selectedFiles: IFileAndObjectUrl[]): Promise<null> {
    try {
      
      setLoader({showLoader: true, loaderText: ""})
      const uploadfilesRes = await uploadFiles(e, selectedFiles)
      if(uploadfilesRes && Array.isArray(uploadfilesRes)){
        clusterData.avatar = uploadfilesRes[0].url
      }
      setLoader({showLoader: true, loaderText: "saving post"})
      const res = viewPurpose === "Edit" ? await updateCluster({...clusterData, clusterId: (prop.clusterId as string)}) : await createCluster(clusterData);
      
      setLoader({showLoader: false, loaderText: ""})
      return null;
    } catch (error) {
      setLoader({showLoader: false, loaderText: ""})
      toast.error((error as IGenericResponse<unknown>).message)
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
                  /^detail/i.test(field) || /^clusterName/i.test(field)
                    ? true
                    : false
                }
                placeHolder={field}
                cssClass=""
                handleChange={handleChange}
                value={(clusterData as any)[field]}
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
            uploadFiles={createNewCluster}
            selectMultipleFiles={selectMultipleFiles}
            />
        </div>
      </div>
    </div>
  );
};
