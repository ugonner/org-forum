import { useQuery } from "react-query";
import { queryFormatter } from "../../generics/utils/queryFormatter";
import { ICategoryDTO, IUpdateCategoryDTO } from "../typings/category";
import { IGenericResponse, QueryReturn } from "../../generics/typings/typngs";
import { requestApi } from "../../generics/contexts/api/base";

export const createCategory = async (payload: ICategoryDTO): Promise<IGenericResponse<ICategoryDTO>> => {
    const res = await  requestApi({
        url: `/category`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const updateCategory = async (payload: IUpdateCategoryDTO ): Promise<IGenericResponse<ICategoryDTO>> => {
    const res = await  requestApi({
        url: `/category`,
        method: "PUT",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const getCategorys = async (payload: {[key: string]: any}): Promise<QueryReturn<ICategoryDTO>>  => {
    const queryString = queryFormatter(payload)

    console.log("url", `/category/categorys${queryString}`, queryString)
    const res = await  requestApi({
        url: `/category/categorys${queryString}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data );
        reject(resBody)
    })
}

export const getCategory = async (categoryId: string): Promise<ICategoryDTO>  => {
    const res = await  requestApi({
        url: `/category/${categoryId}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data?.docs ? resBody.data?.docs: resBody.data );
        reject(resBody)
    })
}

export const useGetCategorysQuery = (payload:  {[key: string]: any}) => useQuery<QueryReturn<ICategoryDTO>>(["getCategorys", payload], () => getCategorys(payload))
export const useGetCategoryQuery = (categoryId: string) => useQuery<ICategoryDTO>(["getCategory", categoryId], () => getCategory(categoryId))
//const {} = useQuery("USERS", () => {})