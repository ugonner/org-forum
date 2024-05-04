import { IClusterDTO } from "../../cluster/typings/cluster";

export interface UserDTO {
    email?: string;
    password?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    gender?: string;
    address?: string;
    dateOfBirth?: string;
    avatar?: string;
    clusters?: IClusterDTO[] | string[];
    _id?: string;
    emailVerified?: boolean;
    roles?: string[];
    status?: string;
}
export interface IUserDTO extends UserDTO {
    email?: string;
    password?: string;
    about?: string;
    
    position?: string;
    positionNote?: string;
    memberType?: string;
}
export interface IUpdateUserDTO extends UserDTO {
    userId: string;
}

export interface IGetEntitiesFromModelArrayPropertyDTO {
    
    basePrimaryId: string;
    
    arrayPropertyName: string;
    
    _page?: number;
    
    _limit?: number;
    fromFeature?: "post" | "user";
    baseEntity?: "post" | "comment" | "user";

  }


