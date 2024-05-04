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

interface ICreateCategoryProp {
  categoryId: string | "create"
}
export const CreateOrUpdateCategory = (prop: ICreateCategoryProp) => {
  const viewPurpose: "Create" | "Edit" = /create/i.test(`${prop.categoryId}`) ? "Create" : "Edit";

  const [categoryData, setCategoryData] = useState({} as ICategoryDTO);
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[])
  const [responseData, setResponseData] = useState({} as IResponseMessageProp);
  
  //let initialData: ICategoryDTO = {} as ICategoryDTO;
useEffect(() => {
  ( async () => {
    try{
      let initData;
      const categoryId = prop.categoryId
      if(viewPurpose === "Edit" && categoryId){
        const res = await getCategory(categoryId)
        setCategoryData(res);
      }
    }catch(error){
      console.log("Error fetching initial data", error)
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
      setResponseData({ isLoading: true, isError: false });
      
      const uploadfilesRes = await uploadFiles(e, selectedFiles)
      if(uploadfilesRes && Array.isArray(uploadfilesRes)){
        categoryData.avatar = uploadfilesRes[0].url
      }
      const res = viewPurpose === "Edit" ? await updateCategory({...categoryData, categoryId: (prop.categoryId as string)}) : await createCategory(categoryData);
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
