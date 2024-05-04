
export interface ICategoryDTO {
    categoryName: string;
    detail?: string;
    avatar?: string;
    lastManagedBy?: string;
    _id?: string;
    noOfPosts?: string;
    
}

export interface IUpdateCategoryDTO extends ICategoryDTO {    
    categoryId: string;
}