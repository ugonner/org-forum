export interface ICreateUser {
    email: string;
    password: string;
    phoneNumber?: string;
    gender?: string;
    firstName: string;
    lastName: string;
}

export interface LoginDTO{
    email: string;
    password: string;
}

export interface RequestForgotPasswordTokenDTO{
    email: string;
}

export interface ResetForgotPasswordDTO extends RequestForgotPasswordTokenDTO {
    token: string;
}

export interface ResetPasswordDTO extends LoginDTO{
    oldPassword: string;
}