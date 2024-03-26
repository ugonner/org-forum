import { IClusterDTO } from "../../cluster/typings/cluster";

export interface UserDTO {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    gender?: string;
    address?: string;
    dateOfBirth?: string;
    avatar?: string;
    clusters?: IClusterDTO[]
}