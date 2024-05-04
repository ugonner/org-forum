import { useQuery } from "react-query";
import { queryFormatter } from "../../generics/utils/queryFormatter";
import { IFocalareaDTO, IUpdateFocalareaDTO } from "../typings/focalarea";
import { IGenericResponse, QueryReturn } from "../../generics/typings/typngs";
import { requestApi } from "../../generics/contexts/api/base";

export const defaultFocalareaImageUrl = `/images/post/post.png`;
export const createFocalarea = async (payload: IFocalareaDTO): Promise<IGenericResponse<IFocalareaDTO>> => {
    const res = await  requestApi({
        url: `/focalarea`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const updateFocalarea = async (payload: IUpdateFocalareaDTO ): Promise<IGenericResponse<IFocalareaDTO>> => {
    const res = await  requestApi({
        url: `/focalarea`,
        method: "PUT",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const getFocalareas = async (payload: {[key: string]: any}): Promise<QueryReturn<IFocalareaDTO>>  => {
    const queryString = queryFormatter(payload)

    console.log("url", `/focalarea/focalareas${queryString}`, queryString)
    const res = await  requestApi({
        url: `/focalarea/focalareas${queryString}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data );
        reject(resBody)
    })
}

export const getFocalarea = async (focalareaId: string): Promise<IFocalareaDTO>  => {
    const res = await  requestApi({
        url: `/focalarea/${focalareaId}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data?.docs ? resBody.data?.docs: resBody.data );
        reject(resBody)
    })
}

export const useGetFocalareasQuery = (payload:  {[key: string]: any}) => useQuery<QueryReturn<IFocalareaDTO>>(["getFocalareas", payload], () => getFocalareas(payload))
export const useGetFocalareaQuery = (focalareaId: string) => useQuery<IFocalareaDTO>(["getFocalarea", focalareaId], () => getFocalarea(focalareaId))
//const {} = useQuery("USERS", () => {})