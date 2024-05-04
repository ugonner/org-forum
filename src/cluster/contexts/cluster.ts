import { useQuery } from "react-query";
import { queryFormatter } from "../../generics/utils/queryFormatter";
import { IClusterDTO, IUpdateClusterDTO } from "../typings/cluster";
import { IGenericResponse, QueryReturn } from "../../generics/typings/typngs";
import { requestApi } from "../../generics/contexts/api/base";

export const defaultClusterImageUrl = `/images/group/group.png`;
export const createCluster = async (payload: IClusterDTO): Promise<IGenericResponse<IClusterDTO>> => {
    const res = await  requestApi({
        url: `/cluster`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const updateCluster = async (payload: IUpdateClusterDTO ): Promise<IGenericResponse<IClusterDTO>> => {
    const res = await  requestApi({
        url: `/cluster`,
        method: "PUT",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const getClusters = async (payload: {[key: string]: any}): Promise<QueryReturn<IClusterDTO>>  => {
    const queryString = queryFormatter(payload)

    console.log("url", `/cluster/clusters${queryString}`, queryString)
    const res = await  requestApi({
        url: `/cluster/clusters${queryString}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data );
        reject(resBody)
    })
}

export const getCluster = async (clusterId: string): Promise<IClusterDTO>  => {
    const res = await  requestApi({
        url: `/cluster/${clusterId}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data?.docs ? resBody.data?.docs: resBody.data );
        reject(resBody)
    })
}

export const useGetClustersQuery = (payload:  {[key: string]: any}) => useQuery<QueryReturn<IClusterDTO>>(["getClusters", payload], () => getClusters(payload))
export const useGetClusterQuery = (clusterId: string) => useQuery<IClusterDTO>(["getCluster", clusterId], () => getCluster(clusterId))
//const {} = useQuery("USERS", () => {})