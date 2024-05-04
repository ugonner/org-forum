
export interface IClusterDTO {
    clusterName: string;
    detail?: string;
    avatar?: string;
    lastManagedBy?: string;
    contactEmail?: string;
    contactPhoneNumber?: string;
    contactAddress?: string;
    _id?: string;
    noOfPosts?: number;
    
}

export interface IUpdateClusterDTO extends IClusterDTO {    
    clusterId: string;
}