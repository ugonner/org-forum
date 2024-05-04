
export interface IFocalareaDTO {
    focalareaName: string;
    detail?: string;
    avatar?: string;
    lastManagedBy?: string;
    _id?: string;
    noOfPosts?: string;
    
}

export interface IUpdateFocalareaDTO extends IFocalareaDTO {    
    focalareaId: string;
}