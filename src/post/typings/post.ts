import { ICreateUser } from "../../auth/typings/auth";
import { ICategoryDTO } from "../../category/typings/category";
import { IClusterDTO } from "../../cluster/typings/cluster";
import { IFocalareaDTO } from "../../focalarea/typings/focalarea";
import { IMedia } from "../../generics/file/typings/media";
import { IUserDTO } from "../../user/typings/user";

export interface IPostDTO {
  title: string;
    content?: string;
  datePublished?: string;
  media?: IMedia;
  isPublished?: boolean
  attachment?: IMedia[];
  user?: IUserDTO;
  clusters?: IClusterDTO[] | string[];
  focalareas?: IFocalareaDTO[] | string[];
  categorys?: ICategoryDTO[] | string[];
  _id?: string;
  noOfLikes?: number;
  noOfComments?: number;
  noOfViews?: number;
  likedBy?: string[]
}


export interface IUpdatePostDTO extends IPostDTO {    
    socialpostId: string;
}


export interface IPostCommentDTO {
  
  socialpost: string;

  content: string;

  attachment?: IMedia[];

  user?: IUserDTO;

  _id?: string;

  noOfLikes?: number;

  likedBy?: string[];
}
export interface IUpdatePostCommentDTO extends IPostCommentDTO{
  commentId: string;
}