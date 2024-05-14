import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ICategoryDTO } from "../typings/category";
import {
  IResponseMessageProp,
  ResponseMessage,
} from "../../generics/components/ResponseMessage";
import { createCategory, getCategory, updateCategory, useGetCategoryQuery } from "../contexts/category";
import { TextInput } from "../../generics/components/form/TextInput";
import { IFileAndObjectUrl } from "../../generics/file/components/MultipleFiles";
import { deleteFile, selectMultipleFiles, uploadFiles } from "../../generics/file/utils/filehooks";
import { MultipleFiles } from "../../generics/file/components/MultipleFiles";
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import { toast } from "react-toastify";
import { IGenericResponse } from "../../generics/typings/typngs";

interface ICreateCategoryProp {
  categoryId: string | "create"
}
export const CreateOrUpdateCategory = (prop: ICreateCategoryProp) => {
  const viewPurpose: "Create" | "Edit" = /create/i.test(`${prop.categoryId}`) ? "Create" : "Edit";

  const [categoryData, setCategoryData] = useState({} as ICategoryDTO);
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[])
  const [responseData, setResponseData] = useState({} as IResponseMessageProp);
  const {setLoader} = useModalContextStore()
  //let initialData: ICategoryDTO = {} as ICategoryDTO;
useEffect(() => {
  ( async () => {
    try{
      
      setLoader({showLoader: true, loaderText: "saving category"})
      const categoryId = prop.categoryId
      if(viewPurpose === "Edit" && categoryId){
        const res = await getCategory(categoryId)
        setCategoryData(res);
      }
      setLoader({showLoader: false, loaderText: ""})
    }catch(error){
      setLoader({showLoader: false, loaderText: ""})
      toast.error((error as IGenericResponse<unknown>).message)
    }
  })()
}, [])
  const inputFields: ICategoryDTO = {
    categoryName: "",
    detail: "",
  };


  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  }

  //Dispatch<SetStateAction<IFileAndObjectUrl[]>>>
  async function createNewCategory(e: FormEvent<HTMLFormElement>, selectedFiles: IFileAndObjectUrl[]): Promise<null> {
    try {
      
      setLoader({showLoader: true, loaderText: "uploading file"})
      const uploadfilesRes = await uploadFiles(e, selectedFiles)
      if(uploadfilesRes && Array.isArray(uploadfilesRes)){
        categoryData.avatar = uploadfilesRes[0].url
      }
      setLoader({showLoader: true, loaderText: "saving"})
      const res = viewPurpose === "Edit" ? await updateCategory({...categoryData, categoryId: (prop.categoryId as string)}) : await createCategory(categoryData);
      
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
                  /^detail/i.test(field) || /^categoryName/i.test(field)
                    ? true
                    : false
                }
                placeHolder={field}
                cssClass=""
                handleChange={handleChange}
                value={(categoryData as any)[field]}
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
            uploadFiles={createNewCategory}
            selectMultipleFiles={selectMultipleFiles}
            />
        </div>
      </div>
    </div>
  );
};
