import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IPostDTO } from "../typings/post";
import {
  IResponseMessageProp,
  ResponseMessage,
} from "../../generics/components/ResponseMessage";
import {
  createPost,
  deletePostAttachmentFiles,
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
import { useModalContextStore } from "../../generics/components/modals/ModalContextProvider";
import {
  GeneralSelect,
  ISelectOption,
} from "../../generics/components/form/Select";
import {
  useGetClusterQuery,
  useGetClustersQuery,
} from "../../cluster/contexts/cluster";
import { useGetFocalareasQuery } from "../../focalarea/contexts/focalarea";
import { TextEditor } from "../../generics/components/form/TextEditor";
import { CustomTextArea } from "../../generics/components/form/CustomTextArea";
import { DisplayMediaFiles } from "../../generics/file/components/DisplayMediaFiles";
import { IDeleteAttachmentFilesDTO } from "../../generics/typings/typngs";
import { toast } from "react-toastify";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { useGetCategoryQuery, useGetCategorysQuery } from "../../category/contexts/category";

interface ICreatePostProp {
  postId: string | "create";
}
export const CreateOrUpdatePost = (prop?: ICreatePostProp) => {
  const navigate = useNavigate();
  const navParams = useParams();
  const postId = navParams.postId ?? `${prop?.postId}`;
  const viewPurpose: "Create" | "Edit" = /create/i.test(`${postId}`)
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
  const [additionalFilesToggleText, setAdditionalFilesToggleText] = useState(
    "posting with post's media file"
  );
  const { setShowModalText } = useModalContextStore();
  const [selectedClusters, setSelectedClusters] = useState(
    [] as ISelectOption[]
  );
  const [selectedCategorys, setSelectedCategorys] = useState(
    [] as ISelectOption[]
  );

  const [selectedFocalareas, setSelectedFocalareas] = useState(
    [] as ISelectOption[]
  );
  //let initialData: IPostDTO = {} as IPostDTO;

  const { data: clustersData } = useGetClustersQuery({});
  const { data: categoryData } = useGetCategorysQuery({});
  const { data: focalareasData } = useGetFocalareasQuery({});
  let focalareas: ISelectOption[] = [];
  let clusters: ISelectOption[] = [];
  let categorys: ISelectOption[] = [];

  useEffect(() => {
    (async () => {
      try {
        if (viewPurpose === "Edit" && postId) {
          const res = await getPost(postId);
          setPostData(res);
          if (clusters?.length > 0) {
            setSelectedClusters(
              clusters.filter((cld) =>
                (res.clusters as string[])?.includes(cld.value)
              )
            );
          }
          if (focalareas?.length > 0) {
            setSelectedFocalareas(
              focalareas.filter((fd) =>
                (res.focalareas as string[])?.includes(fd.value)
              )
            );
          }
          if (categorys?.length > 0) {
            setSelectedCategorys(
              categorys.filter((cd) =>
                (res.categorys as string[])?.includes(cd.value)
              )
            );
          }
        }
      } catch (error) {
        console.log("Error fetching initial data", error);
      }
    })();
  }, []);

  if (focalareasData) {
    focalareas = focalareasData.docs.map((doc) => ({
      label: doc.focalareaName,
      value: `${doc._id}`,
    }));
  }
  if (clustersData) {
    clusters = clustersData.docs.map((doc) => ({
      label: doc.clusterName,
      value: `${doc._id}`,
    }));
  }
  
  if (categoryData) {
    categorys = categoryData.docs.map((doc) => ({
      label: doc.categoryName,
      value: `${doc._id}`,
    }));
  }

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
    mediaFiles: IFileAndObjectUrl[]
  ): Promise<null> {
    try {
      setResponseData({ isLoading: true, isError: false });
      const uploadfilesRes = await uploadFiles(e, mediaFiles);
      if (uploadfilesRes && Array.isArray(uploadfilesRes)) {
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
        postData.media = media;
      }

      const res =
        viewPurpose === "Edit"
          ? await updatePost({
              ...postData,
              socialpostId: postId as string,
            })
          : await createPost(postData);
      setResponseData({
        isLoading: false,
        isError: false,
        data: res.data,
        error: null,
      });
      navigate(-1);
      return null;
    } catch (err) {
      setResponseData({
        isLoading: false,
        isError: true,
        data: null,
        error: err,
      });
      navigate(-1);
      return null;
    }
  }

  const createNewPostWithAdditionalFiles = async (
    e: FormEvent<HTMLFormElement>,
    selectedFiles: IFileAndObjectUrl[]
  ) => {
    alert("got to additional");
    setResponseData({ data: null, isError: false, isLoading: true });
    const uploadPromise = await Promise.allSettled([
      uploadFiles(e, selectedMediaFile),
      uploadFiles(e, selectedFiles),
    ]);

    const mediaFileRes =
      uploadPromise[0].status === "fulfilled" ? uploadPromise[0].value : [];
    const attachmentFilesRes =
      uploadPromise[1].status === "fulfilled" ? uploadPromise[1].value : [];

    if (mediaFileRes && mediaFileRes.length > 0) {
      const {
        fileType: mediaType,
        url: mediaUrl,
        secureUrl: mediaSecureUrl,
        id: mediaId,
      } = mediaFileRes[0];
      //postData.media = {mediaId,mediaUrl: mediaUrl as string, mediaSecureUrl: mediaSecureUrl as string, mediaType}
      const media = {
        mediaId,
        mediaUrl: mediaUrl as string,
        mediaSecureUrl: mediaSecureUrl as string,
        mediaType,
      };
      postData.media = media;
    }
    if (attachmentFilesRes && attachmentFilesRes.length > 0) {
      const attachment: IMedia[] = [];
      attachmentFilesRes.forEach((atFile) => {
        const {
          fileType: mediaType,
          url: mediaUrl,
          secureUrl: mediaSecureUrl,
          id: mediaId,
        } = atFile;
        attachment.push({
          mediaId,
          mediaUrl: mediaUrl as string,
          mediaSecureUrl: mediaSecureUrl as string,
          mediaType,
        });
      });
      //setPostData({ ...postData, attachment });
      postData.attachment = attachment;
    }

    const res =
      viewPurpose === "Edit"
        ? await updatePost({
            ...postData,
            socialpostId: postId as string,
          })
        : await createPost(postData);
    navigate(-1);
    return null;
  };

  const togglePostAdditionalFiles = () => {
    setPostWithAdditionalFiles(!postWithAdditionalFiles);
    if (!postWithAdditionalFiles) {
      setAdditionalFilesToggleText("posting with additional files");
    } else setAdditionalFilesToggleText("posting with post's media file");
  };

  const handleMultiSelectChange = (
    postProperty: string,
    options: ISelectOption[]
  ) => {
    setPostData({
      ...postData,
      [postProperty]: options.map((opt) => opt.value).filter((p) => p),
    });

    if (/cluster/i.test(postProperty)) {
      setSelectedClusters(options);
    } else if (/focalarea/i.test(postProperty)) {
      setSelectedFocalareas(options);
    } else if (/category/i.test(postProperty)) {
      setSelectedCategorys(options);
    }
  };

  const deleteFiles = async (fileUrls: string[]) => {
    const payload: IDeleteAttachmentFilesDTO = {
      attachmentUrls: fileUrls,
      primaryId: `${postData._id}`,
      fromFeature: "post",
    };
    await deletePostAttachmentFiles(payload);
    toast.success("post attachments deleted");
    setPostData((prev) => ({
      ...postData,
      attachment: prev.attachment?.filter(
        (at) => !fileUrls.includes(at.mediaUrl)
      ),
    }));
  };

  return (
    <div className="row">
      <div className="col-sm-7">
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
              <label htmlFor="post-content">Content</label>
              <CustomTextArea
              id="post-content"
                className="form-control"
                onChange={(e) =>
                  setPostData({ ...postData, content: e.target.value })
                }
                defaultValue={postData.content}
                aria-label="post content"
              />
            </div>

            {(clusters.length || focalareas.length) && (
              <div>
                <div className="form-group">
                  <GeneralSelect
                    selectOptions={focalareas}
                    isMulti={true}
                    handleChange={(option: ISelectOption | ISelectOption[]) =>
                      handleMultiSelectChange(
                        "focalareas",
                        option as ISelectOption[]
                      )
                    }
                    value={selectedFocalareas}
                    label="Focal Areas"
                    uniqueId="postFocalareas"
                  />
                </div>
                <div className="form-group">
                  <GeneralSelect
                    selectOptions={clusters}
                    isMulti={true}
                    handleChange={(option: ISelectOption | ISelectOption[]) =>
                      handleMultiSelectChange(
                        "clusters",
                        option as ISelectOption[]
                      )
                    }
                    value={selectedClusters}
                    label="Clusters"
                    uniqueId="postClusters"
                  />
                </div>
                <div className="form-group">
                  <GeneralSelect
                    selectOptions={categorys}
                    isMulti={true}
                    handleChange={(option: ISelectOption | ISelectOption[]) =>
                      handleMultiSelectChange(
                        "categorys",
                        option as ISelectOption[]
                      )
                    }
                    value={selectedCategorys}
                    label="Categorys"
                    uniqueId="postCategorys"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <div className="row">
                <div className="col-sm-2">
                  <img
                    src={postData.media?.mediaUrl}
                    className="w-100 imag-fluid"
                  />
                </div>
                <div className="col-sm-2">
                  <img
                    src={selectedMediaFile[0]?.objectUrl}
                    className="w-100 imag-fluid"
                  />
                </div>
                <div className="col-sm-8"></div>
              </div>
              {/* <MultipleFiles
            key={"post-media"}
            selectedFiles={selectedMediaFile}
            deleteFile={deleteFile}
            setSelectedFiles={setSelectedMediaFile}
            selectMultipleFiles={selectMultipleFiles}
            submitButtonText="upload post media"
            uploadOnChange={false}
            hideSubmitButton={true}
          /> */}

              <input
                multiple={false}
                type="file"
                hidden={true}
                id="fileinput"
                onChange={(e) => {
                  if (!e.target.files) return;
                  const file = e.target.files[0];
                  const fileObj: IFileAndObjectUrl = {
                    file,
                    objectUrl: URL.createObjectURL(file),
                  };
                  setSelectedMediaFile([fileObj]);
                }}
              />
              <div className="text-center">
                <i
                  className="fa fa-upload btn d-1"
                  onClick={() => {
                    document.getElementById("fileinput")?.click();
                  }}
                ></i>
                <br />
                <span className="d-6">Add Post Image</span>
              </div>
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
                  key={"post-attachments"}
                  selectedFiles={selectedFiles}
                  deleteFile={deleteFile}
                  setSelectedFiles={setSelectedFiles}
                  uploadFiles={createNewPostWithAdditionalFiles}
                  selectMultipleFiles={selectMultipleFiles}
                  submitButtonText="upload post attachments"
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
                  >
                    {" "}
                    Upload post{" "}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-sm-5">
        <div className="form-group">
          {postData.attachment?.length && (
            <DisplayMediaFiles
              deleteFile={deleteFiles}
              selectedFiles={postData.attachment}
              mediaOwnerId={postData.user?._id ?? ""}
            />
          )}
        </div>
      </div>
    </div>
  );
};
