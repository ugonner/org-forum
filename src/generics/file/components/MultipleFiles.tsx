import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { DisplayMultipleFiles } from "./DisplayMultipleFiles";
import { IFile } from "../typings/file";

export interface IFileAndObjectUrl {
  file: File;
  objectUrl: string;
}
export interface IMultipleFilesProps {
  selectMultipleFiles: (e: ChangeEvent<HTMLInputElement>, setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>) => void;
  uploadFiles?: (e: FormEvent<HTMLFormElement>, selectedFiles: IFileAndObjectUrl[], uploadConfig?: {[key: string]: string}) => Promise<IFile[] | null>;
  deleteFile: (fileOb: IFileAndObjectUrl, setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>) => void;
  selectedFiles: IFileAndObjectUrl[];
  setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>;
  uploadOnChange?: boolean;
  submitButtonText?: string;
  fileInputAccept?: string;
  fileLabelText?: string;
}

export const MultipleFiles = (prop: IMultipleFilesProps) => {
  const [submitButtonText, setSubmitButtonText] =  useState(prop.submitButtonText ?? "upload")
  const submitFiles = async (e: FormEvent<HTMLFormElement>) => {
    
    setSubmitButtonText("uploading")
      if(prop.uploadFiles){
        await prop.uploadFiles(e, prop.selectedFiles);
      }
      setSubmitButtonText("Done")
     
  }
  return (
    <div>
      <DisplayMultipleFiles
        selectedFiles={prop.selectedFiles}
        deleteFile={prop.deleteFile}
        setSelectedFiles={prop.setSelectedFiles}
      />
      <form
        name="uploadFiles"
        encType="multipart/form-data"
        onSubmit={(e) => submitFiles(e)}
      >
        <div className="form-group">
          <input
            id="extra_files"
            type="file"
            name="file[]"
            multiple={true}
            onChange={(e) => prop.selectMultipleFiles(e, prop.setSelectedFiles)}
            hidden={true}
            accept={prop.fileInputAccept ?? "*"}
          />
        </div>
        <div className="form-group text-center">
          <i
            className="fa fa-gallery glyphicon glyphicon-folder btn btn-transparent"
            style={{ fontSize: "5em" }}
            onClick={() => document.getElementById("extra_files")?.click()}
            aria-label="click to select file for upload"
          ></i>
          <br />
          <span className="text-center d-4 my-3 font-weight-bold">[prop.fileLabelText ?? "add files"]</span>
        </div>
        {
          prop.uploadOnChange && (
            
        <button type="submit" className="btn w-100">
        {submitButtonText ?? "upload"}
      </button>
          )
        }
      </form>
    </div>
  );
};
