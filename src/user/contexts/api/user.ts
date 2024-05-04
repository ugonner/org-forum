import { useQuery } from "react-query";
import { queryFormatter } from "../../../generics/utils/queryFormatter";
import { IUserDTO, IUpdateUserDTO, IGetEntitiesFromModelArrayPropertyDTO } from "../../typings/user";
import { IAddOrRemoveFromGroupDTO, IGenericResponse, QueryReturn } from "../../../generics/typings/typngs";
import { baseURL, requestApi } from "../../../generics/contexts/api/base";
import { IUserMessageConfigDTO } from "../../typings/user-messaging";
import { toast } from "react-toastify";
import { useModalContextStore } from "../../../generics/components/modals/ModalContextProvider";

export const defaultUserImageUrl = `/images/user/user.png`;

export const createUser = async (payload: IUserDTO): Promise<IGenericResponse<IUserDTO>> => {
    const res = await  requestApi({
        url: `/user`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const updateUser = async (payload: IUpdateUserDTO ): Promise<IGenericResponse<IUserDTO>> => {
    const res = await  requestApi({
        url: `/user`,
        method: "PUT",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}
export const updateUserAdmin = async (payload: IUpdateUserDTO ): Promise<IGenericResponse<IUserDTO>> => {
    const res = await  requestApi({
        url: `/user/admin`,
        method: "PUT",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const addOrRemoveUserFromGroup = async (payload: IAddOrRemoveFromGroupDTO<string> ): Promise<IGenericResponse<boolean>> => {
    const res = await  requestApi({
        url: `/user/add-or-remove`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}


export const sendMessageToUsers = async (payload: IUserMessageConfigDTO, queryPayload: {[key: string]: string}): Promise<IGenericResponse<IUserDTO>> => {
    const queryString = queryFormatter(queryPayload);
    const res = await  requestApi({
        url: `/user/send-message/${queryString}`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        toast.error(resBody.message)
        reject(resBody)
    })
}

export const getUsers = async (payload: {[key: string]: any}): Promise<QueryReturn<IUserDTO>>  => {
    const queryString = queryFormatter(payload)

    console.log("url", `/user/users${queryString}`, queryString)
    const res = await  requestApi({
        url: `/user/users${queryString}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data );
        reject(resBody)
    })
}

export const getUsersFromEntityGroupProperty = async (payload: IGetEntitiesFromModelArrayPropertyDTO): Promise<QueryReturn<IUserDTO>>  => {
    const queryString = queryFormatter(payload)

    const res = await  requestApi({
        url: `/${payload.fromFeature}/people/${payload.baseEntity}${queryString}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data );
        reject(resBody)
    })
}

export const getUser = async (userId: string): Promise<IUserDTO>  => {
    const res = await  requestApi({
        url: `/user/${userId}`,
        method: "GET"
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody.data?.docs ? resBody.data?.docs: resBody.data );
        reject(resBody)
    })
}

export const useGetUsersQuery = (payload:  {[key: string]: any}) => useQuery<QueryReturn<IUserDTO>>(["getUsers", payload], () => getUsers(payload))
export const useGetUserQuery = (userId: string) => useQuery<IUserDTO>(["getUser", userId], () => getUser(userId))
//const {} = useQuery("USERS", () => {})