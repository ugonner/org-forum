import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { DisplayMultipleFiles } from "./DisplayMultipleFiles";
import { IFile } from "../typings/file";

export interface IFileAndObjectUrl {
  file: File;
  objectUrl: string;
}
export interface IMultipleFilesProps {
  selectMultipleFiles: (e: ChangeEvent<HTMLInputElement>, setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>) => void;
  uploadFiles: (e: FormEvent<HTMLFormElement>, selectedFiles: IFileAndObjectUrl[]) => Promise<IFile[] | null>;
  deleteFile: (fileOb: IFileAndObjectUrl, setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>) => void;
  selectedFiles: IFileAndObjectUrl[];
  setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>;
}

export const MultipleFiles = (prop: IMultipleFilesProps) => {
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
        onSubmit={(e) => prop.uploadFiles(e, prop.selectedFiles)}
      >
        <div className="form-group">
          <input
            id="extra_files"
            type="file"
            name="file[]"
            multiple={true}
            onChange={(e) => prop.selectMultipleFiles(e, prop.setSelectedFiles)}
            hidden={true}
          />
        </div>
        <div className="form-group text-center">
          <i
            className="fa fa-gallery glyphicon glyphicon-folder btn btn-transparent"
            style={{ fontSize: "5em" }}
            onClick={() => document.getElementById("extra_files")?.click()}
          ></i>
          <br />
          <span className="d-4 my-3 font-weight-bold">Add files</span>
        </div>
        <button type="submit" className="btn w-100">
          upload
        </button>
      </form>
    </div>
  );
};
