import { useMutation } from "react-query"
import { requestApiFormData } from "../../contexts/base"
import { IGenericResponse } from "../../typings/typngs"
import { IFile } from "../typings/file"

export const uploadMultipleFiles = async (payload: FormData, section: string): Promise<IGenericResponse<IFile[]>> => {
    
    const res = await  requestApiFormData({
        url: `/file/upload/multiple/${section}`,
        method: "POST",
        payload,
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}