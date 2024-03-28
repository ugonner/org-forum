import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IPostDTO } from "../typings/post";
import {
  IResponseMessageProp,
  ResponseMessage,
} from "../../generics/components/ResponseMessage";
import {
  createPost,
  getPost,
  updatePost,
  useGetPostQuery,
} from "../contexts/post";
import { TextInput } from "../../generics/components/form/TextInput";
import { IFileAndObjectUrl } from "../../generics/file/components/MultipleFiles";
import {
  deleteFile,
  selectMultipleFiles,
  uploadFiles,
} from "../../generics/file/utils/filehooks";
import { MultipleFiles } from "../../generics/file/components/MultipleFiles";
import { IMedia } from "../../generics/file/typings/media";

interface ICreatePostProp {
  postId: string | "create";
}
export const CreateOrUpdatePost = (prop: ICreatePostProp) => {
  const viewPurpose: "Create" | "Edit" = /create/i.test(`${prop.postId}`)
    ? "Create"
    : "Edit";

  const [postData, setPostData] = useState({} as IPostDTO);
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[]);
  const [responseData, setResponseData] = useState({} as IResponseMessageProp);
  const [uploadFilesConfig, setUploadFilesConfig] = useState({
    uploadIntent: "media",
  } as { uploadIntent: "media" | "attachment" });
  const [postWithAdditionalFiles, setPostWithAdditionalFiles] = useState(false);
  const [selectedMediaFile, setSelectedMediaFile] = useState(
    [] as IFileAndObjectUrl[]
  );
  const [additionalFilesToggleText, setAdditionalFilesToggleText] = useState("posting with post's media file");
  //let initialData: IPostDTO = {} as IPostDTO;
  useEffect(() => {
    (async () => {
      try {
        let initData;
        const postId = prop.postId;
        if (viewPurpose === "Edit" && postId) {
          const res = await getPost(postId);
          setPostData(res);
        }
      } catch (error) {
        console.log("Error fetching initial data", error);
      }
    })();
  }, []);
  const inputFields: IPostDTO = {
    title: "",
  };

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPostData({ ...postData, [name]: value });
  }

  //Dispatch<SetStateAction<IFileAndObjectUrl[]>>>
  async function createNewPost(
    e: FormEvent<HTMLFormElement>,
    selectedFiles: IFileAndObjectUrl[]
  ): Promise<null> {
    try {
      setResponseData({ isLoading: true, isError: false });

      const uploadfilesRes = await uploadFiles(e, selectedFiles);
      if (uploadfilesRes && Array.isArray(uploadfilesRes)) {
        if (uploadFilesConfig.uploadIntent === "media") {
          const {
            fileType: mediaType,
            url: mediaUrl,
            secureUrl: mediaSecureUrl,
            id: mediaId,
          } = uploadfilesRes[0];
          //postData.media = {mediaId,mediaUrl: mediaUrl as string, mediaSecureUrl: mediaSecureUrl as string, mediaType}
          const media = {
            mediaId,
            mediaUrl: mediaUrl as string,
            mediaSecureUrl: mediaSecureUrl as string,
            mediaType,
          };
          setPostData({ ...postData, media });
        } else if (uploadFilesConfig.uploadIntent === "attachment") {
          const attachment: IMedia[] = [];
          uploadfilesRes.forEach((fileRes) => {
            const {
              fileType: mediaType,
              url: mediaUrl,
              secureUrl: mediaSecureUrl,
              id: mediaId,
            } = fileRes;
            //postData.attachment?.push({mediaId,mediaUrl: mediaUrl as string, mediaSecureUrl: mediaSecureUrl as string, mediaType})
            attachment.push({
              mediaId,
              mediaUrl: mediaUrl as string,
              mediaSecureUrl: mediaSecureUrl as string,
              mediaType,
            });
          });
          setPostData({ ...postData, attachment });
        }
      }
      const res =
        viewPurpose === "Edit"
          ? await updatePost({
              ...postData,
              socialpostId: prop.postId as string,
            })
          : await createPost(postData);
      setResponseData({
        isLoading: false,
        isError: false,
        data: res.data,
        error: null,
      });
      return null;
    } catch (err) {
      setResponseData({
        isLoading: false,
        isError: true,
        data: null,
        error: err,
      });
      return null;
    }
  }

  const togglePostAdditionalFiles = () => {
    setPostWithAdditionalFiles(!postWithAdditionalFiles);
    if (postWithAdditionalFiles) {
      setAdditionalFilesToggleText("posting with additional files");
    } else setAdditionalFilesToggleText("posting with post's media file");
  };

  return (
    <div className="form-group">
      <div>
        <ResponseMessage
          isLoading={responseData.isLoading}
          isError={responseData.isError}
          data={responseData.data}
          error={responseData.error}
        />
        <div>
          {Object.keys(inputFields).map((field, i) => {
            return (
              <div key={i}>
                <TextInput
                  inputName={field}
                  inputLabel={field}
                  required={
                    /^detail/i.test(field) || /^postName/i.test(field)
                      ? true
                      : false
                  }
                  placeHolder={field}
                  cssClass=""
                  handleChange={handleChange}
                  value={(postData as any)[field]}
                />
              </div>
            );
          })}
        </div>
        <div className="form-group">
          <MultipleFiles
            selectedFiles={selectedMediaFile}
            deleteFile={deleteFile}
            setSelectedFiles={setSelectedMediaFile}
            selectMultipleFiles={selectMultipleFiles}
            submitButtonText="upload post media"
          />
        </div>

        <div className="form-group">
          <button
            className="btn btn-primary"
            onClick={togglePostAdditionalFiles}
          >
            {additionalFilesToggleText}
          </button>
        </div>
        <div className="form-group">
          {postWithAdditionalFiles ? (
            <MultipleFiles
              selectedFiles={selectedFiles}
              deleteFile={deleteFile}
              setSelectedFiles={setSelectedFiles}
              uploadFiles={createNewPost}
              selectMultipleFiles={selectMultipleFiles}
              submitButtonText="upload post media"
            />
          ) : (
            <div>
              <button
                className="btn btn-primary w-100"
                onClick={(e) =>
                  createNewPost(
                    e as unknown as FormEvent<HTMLFormElement>,
                    selectedMediaFile
                  )
                }
              ></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
