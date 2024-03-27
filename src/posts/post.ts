import { useMutation } from "react-query"
import { requestApi } from "../generics/contexts/api/base"
import { ICreateUser, LoginDTO, RequestForgotPasswordTokenDTO, ResetForgotPasswordDTO, ResetPasswordDTO } from "../auth/typings/auth"
import { IGenericResponse } from "../generics/typings/typngs"
import { UserDTO } from "../user/typings"

export const createUser = async (userData: ICreateUser): Promise<IGenericResponse<UserDTO>> => {
    
    const res = await  requestApi({
        url: `/social-post`,
        method: "POST",
        payload: userData
    })
    const resBody = await res.json();
    return new Promise((resolve, reject) => {
        if(resBody.status) resolve(resBody);
        reject(resBody)
    })
}


const useCreateUserMutation = () => useMutation(createUser)

const postStore = {
    useCreateUserMutation
}
export default postStore;