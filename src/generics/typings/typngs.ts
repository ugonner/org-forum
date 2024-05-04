export interface IGenericResponse<TRespnseDataType> {
  statusCode: number;
  status: boolean;
  message: string;
  data?: TRespnseDataType;
  error?: Error;
}

export type QueryReturn<DT> = {
  docs: DT[];
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  previousPage: number | null;
  nextPage: number | null;
  totalDocs: number;
  totalPages: number;
};

export interface IDeleteAttachmentFilesDTO {
  attachmentUrls: string[];
  primaryId: string;
  fromFeature: string; //entity that has tee attachments eg post
}

export interface IAddOrRemoveFromGroupDTO<T> {
  primaryId: string;
  propertyValue: T;

  forwardAction: boolean;
  propertyName: string;

  primaryIncrementField?: string;
}
