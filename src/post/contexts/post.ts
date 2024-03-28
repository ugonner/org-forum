import { useQuery } from "react-query";
import { queryFormatter } from "../../generics/utils/queryFormatter";
import { IGenericResponse, QueryReturn } from "../../generics/typings/typngs";
import { requestApi } from "../../generics/contexts/api/base";
import { IPostDTO, IUpdatePostDTO } from "../typings/post";

export const createPost = async (payload: IPostDTO): Promise<IGenericResponse<IPostDTO>> => {
    const res = await  requestApi({
        url: `/socialpost`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const updatePost = async (payload: IUpdatePostDTO ): Promise<IGenericResponse<IPostDTO>> => {
    const res = await  requestApi({
        url: `/post`,
        method: "PUT",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const getPosts = async (payload: {[key: string]: any}): Promise<QueryReturn<IPostDTO>>  => {
    const queryString = queryFormatter(payload)

    const res = await  requestApi({
        url: `/socialpost/posts${queryString}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data );
        reject(resBody)
    })
}

export const getPost = async (postId: string): Promise<IPostDTO>  => {
    const res = await  requestApi({
        url: `/post/${postId}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data?.docs ? resBody.data?.docs: resBody.data );
        reject(resBody)
    })
}

export const useGetPostsQuery = (payload:  {[key: string]: any}) => useQuery<QueryReturn<IPostDTO>>(["getPosts", payload], () => getPosts(payload))
export const useGetPostQuery = (postId: string) => useQuery<IPostDTO>(["getPost", postId], () => getPost(postId))
//const {} = useQuery("USERS", () => {})