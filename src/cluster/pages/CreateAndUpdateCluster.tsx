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

interface ICreateClusterProp {
  clusterId: string | "create"
}
export const CreateOrUpdateCluster = (prop: ICreateClusterProp) => {
  const viewPurpose: "Create" | "Edit" = /create/i.test(`${prop.clusterId}`) ? "Create" : "Edit";

  const [clusterData, setClusterData] = useState({} as IClusterDTO);
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[])
  const [responseData, setResponseData] = useState({} as IResponseMessageProp);
  
  //let initialData: IClusterDTO = {} as IClusterDTO;
useEffect(() => {
  ( async () => {
    try{
      let initData;
      const clusterId = prop.clusterId
      if(viewPurpose === "Edit" && clusterId){
        const res = await getCluster(clusterId)
        setClusterData(res);
      }
    }catch(error){
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
      setResponseData({ isLoading: true, isError: false });
      
      const uploadfilesRes = await uploadFiles(e, selectedFiles)
      if(uploadfilesRes && Array.isArray(uploadfilesRes)){
        clusterData.avatar = uploadfilesRes[0].url
      }
      const res = viewPurpose === "Edit" ? await updateCluster({...clusterData, clusterId: (prop.clusterId as string)}) : await createCluster(clusterData);
      setResponseData({
        isLoading: false,
        isError: false,
        data: res.data,
        error: null,
      });
      return null;
    } catch (err) {
      setResponseData({
        isLoading: false,
        isError: true,
        data: null,
        error: err,
      });
      return null;
    }
  }
  
  return (
    <div className="form-group">
      <div>
        <ResponseMessage
          isLoading={responseData.isLoading}
          isError={responseData.isError}
          data={responseData.data}
          error={responseData.error}
        />
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
