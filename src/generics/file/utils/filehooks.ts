import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { IFileAndObjectUrl } from "../components/MultipleFiles";
import { uploadMultipleFiles } from "../contexts/file";
import { IFile } from "../typings/file";
import { IGenericResponse } from "../../typings/typngs";

export const selectMultipleFiles = (
  e: ChangeEvent<HTMLInputElement>,
  setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>
) => {
  const files = e.target.files;
  if (files) {
    const fileAndUrls: IFileAndObjectUrl[] = [];
    for (let i = 0; i < files.length; i++) {
      const objectUrl = URL.createObjectURL(files[i]);
      fileAndUrls.push({
        file: files[i],
        objectUrl,
      });
    }
    setSelectedFiles((prev) => [...prev, ...fileAndUrls]);
  }
};

export const uploadFiles = async (
  e: FormEvent<HTMLFormElement>,
  selectedFiles: IFileAndObjectUrl[]
): Promise<IFile[] | null> => {
  try {
    e.preventDefault && e.preventDefault();
    if (selectedFiles.length === 0) return null;

    const payload = new FormData();

    selectedFiles.forEach((fileAndUrl, i) => {
      payload.append("file[]", fileAndUrl.file);
    });

    const res = await uploadMultipleFiles(payload, "posts");
    return res.data as IFile[];
  } catch (error: any) {
    return error;
  }
};

export const deleteFile = (
  fileObj: IFileAndObjectUrl,
  setSelectedFiles: Dispatch<SetStateAction<IFileAndObjectUrl[]>>
) => {
  setSelectedFiles((prev) =>
    prev.filter((f) => f.objectUrl !== fileObj.objectUrl)
  );
  URL.revokeObjectURL(fileObj.objectUrl);
};
