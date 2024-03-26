import { IMedia } from "../../generics/file/typings/media";

export interface ISocialpostCommentDTO {
  socialpost: string;
content: string;
attachment?: IMedia[];
}
