import { useQuery } from "react-query";
import { queryFormatter } from "../../generics/utils/queryFormatter";
import { IAddOrRemoveFromGroupDTO, IDeleteAttachmentFilesDTO, IGenericResponse, QueryReturn } from "../../generics/typings/typngs";
import { baseURL, requestApi } from "../../generics/contexts/api/base";
import { IPostCommentDTO, IPostDTO, IUpdatePostCommentDTO, IUpdatePostDTO } from "../typings/post";

export const defaultPostImageUrl = `/images/post/post.png`;

export const createPost = async (payload: IPostDTO): Promise<IGenericResponse<IPostDTO>> => {
    const res = await  requestApi({
        url: `/post`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}
export const createPostComment = async (payload: IPostCommentDTO): Promise<IGenericResponse<IPostDTO>> => {
    const res = await  requestApi({
        url: `/post/comment`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const deletePostAttachmentFiles = async (payload: IDeleteAttachmentFilesDTO): Promise<IGenericResponse<IPostDTO>> => {
    const res = await  requestApi({
        url: `/post/attachments`,
        method: "DELETE",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        console.log("error", resBody)
        reject(resBody)
    })
}

export const updatePost = async (payload: IUpdatePostDTO ): Promise<IGenericResponse<IPostDTO>> => {
    const res = await  requestApi({
        url: `/post/admin`,
        method: "PUT",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const updatePostComment = async (payload: IUpdatePostCommentDTO ): Promise<IGenericResponse<IPostDTO>> => {
    const res = await  requestApi({
        url: `/post/comment`,
        method: "PUT",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}
export const addOrRemoveEntityFromGroup = async (payload: IAddOrRemoveFromGroupDTO<string>, fromFeature: String ): Promise<IGenericResponse<boolean>> => {
    const res = await  requestApi({
        url: `/post/add-or-remove/${fromFeature}`,
        method: "POST",
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
        url: `/post/posts${queryString}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data );
        reject(resBody)
    })
}
export const getPostComments = async (payload: {[key: string]: any}): Promise<QueryReturn<IPostCommentDTO>>  => {
    const queryString = queryFormatter(payload)

    const res = await  requestApi({
        url: `/post/comments${queryString}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data );
        reject(resBody)
    })
}

export const getPostsCount = async (payload: {[key: string]: any}): Promise<{totalDocs: number}>  => {
    const queryString = queryFormatter(payload)

    const res = await  requestApi({
        url: `/post/count${queryString}`,
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
export const useGetPostCountsQuery = (payload:  {[key: string]: any}) => useQuery<{totalDocs: number}>(["getPostsCount", payload], () => getPostsCount(payload))
export const useGetPostQuery = (postId: string) => useQuery<IPostDTO>(["getPost", postId], () => getPost(postId))
//const {} = useQuery("USERS", () => {})