import { useMutation } from "react-query"
import { requestApi } from "../../generics/contexts/api/base"
import { ICreateUser, LoginDTO, RequestForgotPasswordTokenDTO, ResetForgotPasswordDTO, ResetPasswordDTO } from "../typings/auth"
import { IGenericResponse } from "../../generics/typings/typngs"
import { UserDTO } from "../../user/typings"

export const createUser = async (userData: ICreateUser): Promise<IGenericResponse<UserDTO>> => {
    const res = await  requestApi({
        url: `/auth`,
        method: "POST",
        payload: userData
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const requestVerificationEmail = async (userData: {email: string;}): Promise<IGenericResponse<ICreateUser>> => {
    const res = await requestApi({
        url: `/auth/request-verification-email`,
        method: "POST",
        payload: userData
    })
    
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const verifyUser = async (userData: {email: string; token: string;}): Promise<IGenericResponse<ICreateUser>> => {
    const res = await requestApi({
        url: `/auth/verify-user`,
        method: "POST",
        payload: userData
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}


export const loginUser = async (req: LoginDTO): Promise<IGenericResponse<{email: string; token: string;}>> => {
    const res = await requestApi({
        url: `/auth/login`,
        method: "POST",
        payload: req
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}


export const requestForgotPasswordToken = async (payload: RequestForgotPasswordTokenDTO): Promise<IGenericResponse<UserDTO>> => {
    const res = await requestApi({
        url: `/auth/forgot-password`,
        method: "POST",
        payload: payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}


export const resetForgotPassword = async (payload: ResetForgotPasswordDTO): Promise<IGenericResponse<UserDTO>> => {
    const res = await requestApi({
        url: `/auth/reset-forgot-password`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}

export const resetPassword = async (payload: ResetPasswordDTO): Promise<IGenericResponse<ICreateUser>> => {
    const res = await requestApi({
        url: `/auth/reset-password`,
        method: "POST",
        payload
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}
const useCreateUserMutation = () => useMutation(createUser)
const useVerifyUserMutation = () => useMutation(verifyUser);
const useLoginUserMutation = () => useMutation(loginUser);
const useRequestForgotPasswordTokenMutation = () => useMutation(requestForgotPasswordToken);
const useResetForgotPasswordMutation = () => useMutation(resetForgotPassword);
const useRequestVerificationEmailMutation = () => useMutation(requestVerificationEmail);
const useResetPasswordMutation = () => useMutation(resetPassword);

const useAuthStore = {
    useCreateUserMutation,
    useRequestVerificationEmailMutation,
    useVerifyUserMutation,
    useLoginUserMutation,
    useRequestForgotPasswordTokenMutation,
    useResetForgotPasswordMutation,
    useResetPasswordMutation

}
export default useAuthStore