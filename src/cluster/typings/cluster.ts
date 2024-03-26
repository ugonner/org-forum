
export interface IClusterDTO {
    clusterName: string;
    detail?: string;
    avatar?: string;
    lastManagedBy?: string;
    contactEmail?: string;
    contactPhoneNumber?: string;
    contactAddress?: string;
    
}

export interface IUpdateClusterDTO extends IClusterDTO {    
    clusterId: string;
}