import { IMedia } from "../../generics/file/typings/media";

export interface IPostDTO {
  title: string;
    content?: string;
  datePublished?: string;
  media?: IMedia;
  isPublished?: boolean
  attachment?: IMedia[];
}


export interface IUpdatePostDTO extends IPostDTO {    
    socialpostId: string;
}