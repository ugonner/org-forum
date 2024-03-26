import { IMedia } from "../../generics/file/typings/media";

export interface ISocialpostDTO {
  title: string;
  content: string;
  datePublished: string;
  media: IMedia;
 attachment?: IMedia[];
}

