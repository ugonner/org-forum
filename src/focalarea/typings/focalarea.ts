
export interface IFocalareaDTO {
    focalareaName: string;
    detail?: string;
    avatar?: string;
    lastManagedBy?: string;
    contactEmail?: string;
    contactPhoneNumber?: string;
    contactAddress?: string;
    
}

export interface IUpdateFocalareaDTO extends IFocalareaDTO {    
    focalareaId: string;
}