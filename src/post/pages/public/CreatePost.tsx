import {
  ChangeEvent,
  DetailedHTMLProps,
  FormEvent,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { IPostDTO } from "../../typings/post";
import { ISelectOption } from "../../../generics/components/form/Select";
import {
  IFileAndObjectUrl,
  IMultipleFilesProps,
} from "../../../generics/file/components/MultipleFiles";
import { createPost, defaultPostImageUrl, deletePostAttachmentFiles, getPost, updatePost } from "../../contexts/post";
import { getClusters } from "../../../cluster/contexts/cluster";
import { IClusterDTO } from "../../../cluster/typings/cluster";
import {
  FormDisplay,
  IInputFieldWithPageNumber,
} from "../../../generics/components/form/FormDisplay";
import { ITextInput } from "../../../generics/components/form/TextInput";
import {
  deleteFile,
  selectMultipleFiles,
  uploadFiles,
} from "../../../generics/file/utils/filehooks";
import { IMedia } from "../../../generics/file/typings/media";
import { toast } from "react-toastify";
import { buildSearchObj } from "../../../generics/utils";
import { DisplayMediaFiles } from "../../../generics/file/components/DisplayMediaFiles";
import { IDeleteAttachmentFilesDTO, IGenericResponse } from "../../../generics/typings/typngs";
import { IFocalareaDTO } from "../../../focalarea/typings/focalarea";
import { ICategoryDTO } from "../../../category/typings/category";
import { useModalContextStore } from "../../../generics/components/modals/ModalContextProvider";

export const CreatePostInStages = () => {
  const navParam = useParams();
  const { search } = useLocation();
  const searchQbj = buildSearchObj(search);

  const postId = navParam.postId;
  const localUserString = localStorage.getItem("user");
  const localUser = JSON.parse(`${localUserString}`);

  const [post, setPost] = useState({} as IPostDTO);
  const [pageMessage, setPageMessage] = useState(
    {} as { [key: string]: string }
  );

  const initGenderOptions: ISelectOption[] = [
    { label: "MAle", value: "M" },
    { label: "female", value: "F" },
  ];

  const [page, setPage] = useState(4);
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[]);
  const [selectedAttachmentFiles, setSelectedAttachmentFiles] = useState(
    [] as IFileAndObjectUrl[]
  );
  const {setLoader} = useModalContextStore()
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      try{
        
      if (/create/i.test(`${postId}`)) return;

      setLoader({showLoader: true, loaderText: "getting post data"})
      const postRes = await getPost(`${postId}`);

      if (
        !/create/i.test(`${postId}`) &&
        postRes.user?._id != localUser.userId
      ) {
        toast.error("you are trying to update a post you don't own");
       
      setLoader({showLoader: false, loaderText: ""})
        navigate(`/auth/login`);
      }
      setPost(postRes);
      setLoader({showLoader: false, loaderText: ""})
      }catch(error){
        setLoader({showLoader: false, loaderText: ""})
        toast.error((error as IGenericResponse<unknown>).message)
      }
    })();
  }, []);

  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const postInputFields: IInputFieldWithPageNumber[] = [
    {
      pageNumber: 4,
      inputType: "text",
      inputProp: {
        inputLabel: "title",
        inputName: "title",
        inputType: "text",
        required: true,
        value: post.title,
        placeholder: "post short title",
        cssClass: "",
        handleChange: handleTextInputChange,
      } as ITextInput,
    },

    {
      pageNumber: 4,
      inputType: "textarea",
      inputProp: {
        label: "post content",
        id: "post-content",
        name: "content",
        required: true,
        value: post.content,
        placeholder: "post content",
        className: "form-control",
        onChange: handleTextInputChange,
      } as unknown as DetailedHTMLProps<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
      >,
    },
    {
      pageNumber: 5,
      inputType: "file",
      inputProp: {
        selectedFiles,
        setSelectedFiles,
        selectMultipleFiles: selectMultipleFiles,
        deleteFile: deleteFile,
        hideSubmitButton: true,
        fileInputAccept: "image/*",
        fileLabelText: "upload post image",
        fileInputId: "post-media-image",
      } as IMultipleFilesProps,
    },
    {
      pageNumber: 6,
      inputType: "file",
      inputProp: {
        selectedFiles: selectedAttachmentFiles,
        setSelectedFiles: setSelectedAttachmentFiles,
        selectMultipleFiles: selectMultipleFiles,
        deleteFile: deleteFile,
        hideSubmitButton: true,
        fileInputAccept: "*",
        fileLabelText: "upload more media",
        fileInputId: "post-attachment-files",
      } as IMultipleFilesProps,
    },
  ];
    
  const deletePostMediaFiles = async (fileUrls: string[]) => {
    try{
      const payload: IDeleteAttachmentFilesDTO = {
        attachmentUrls: fileUrls,
        primaryId: `${post._id}`,
        fromFeature: "post",
      };
      setLoader({showLoader: true, loaderText: "DELETING ATTACHMENT"})
      await deletePostAttachmentFiles(payload);
      toast.success("post attachments deleted");
      setPost((prev) => ({
        ...post,
        attachment: prev.attachment?.filter(
          (at) => !fileUrls.includes(at.mediaUrl)
        ),
      }));
      setLoader({showLoader: false, loaderText: ""});
    }catch(error){
      setLoader({showLoader: false, loaderText: ""});
      toast.error((error as IGenericResponse<unknown>).message)
    }
  };


  const submitPost = async () => {
    try {
      if (selectedFiles.length < 1)
        toast.error("you must upload at least one picture for the post");

      setLoader({showLoader: true, loaderText: "uploading files"});
      const res = await uploadFiles(
        {} as FormEvent<HTMLFormElement>,
        selectedFiles
      );
      if (res?.length) {
        post.media = {
          mediaId: res[0].id as string,
          mediaType: res[0].fileType as string,
          mediaSecureUrl: res[0].secureUrl as string,
          mediaUrl: res[0].url as string,
        };
      }
      
      if (selectedAttachmentFiles.length > 0) {
        setLoader({showLoader: true, loaderText: "uploading attachments"});
        const res = await uploadFiles(
          {} as FormEvent<HTMLFormElement>,
          selectedAttachmentFiles
        );
        if (res && res?.length > 0) {
          const attachment = res.map((r) => {
            const media: IMedia = {
              mediaId: `${r.id}`,
              mediaType: `${r.fileType}`,
              mediaSecureUrl: `${r.secureUrl}`,
              mediaUrl: `${r.url}`,
            };
            return media;
          });
          post.attachment = attachment;
        }
      }
      
      if (postId && !/create/i.test(postId)) {
        
      //handle populated clusters values
      if((post.clusters as IClusterDTO[])[0]?._id){
        post.clusters = (post.clusters as IClusterDTO[]).map((cluster) => `${cluster._id}`)
      }
      //handle populated focalarea values
      if((post.focalareas as IFocalareaDTO[])[0]?._id){
        post.focalareas = (post.focalareas as IFocalareaDTO[]).map((cluster) => `${cluster._id}`)
      }

      
      //handle populated category values
      if((post.categorys as ICategoryDTO[])[0]?._id){
        post.categorys = (post.categorys as ICategoryDTO[]).map((cluster) => `${cluster._id}`)
      }
      setLoader({showLoader: true, loaderText: "updating post"});
        await updatePost({ ...post, socialpostId: postId });
      } else {
        ["clusters", "focalareas", "categorys"].forEach((f) => {
          if (searchQbj[f]) {
            (post as unknown as { [key: string]: string[] })[f] = [`${searchQbj[f]}`];
          }
        });
        setLoader({showLoader: true, loaderText: "creating post"});
        await createPost(post);
      }
      setLoader({showLoader: false, loaderText: ""});
      navigate(`/post/posts/${search}`);
    } catch (error) {
      setLoader({showLoader: false, loaderText: ""});
      toast.error((error as any).message);
    }
  };

  const tabs: {pageNumber: number; label: string}[] = [
    {
        pageNumber: 4,
        label: "Post Texts"
    },
    {
        pageNumber: 5,
        label: "Post image"
    },
    {
        pageNumber: 6,
        label: "Additional files"
    }
  ]
  const [message, setMessage] = useState("");
  return (
    <div className="row">
        <div className="col-3">
            {
                tabs.map((tab) => (
                    <div 
                    className="m-4 text-center"
                    role="button"
                    onClick={() => setPage(tab.pageNumber)}
                    >
                        {tab.label}
                    </div>
                ))
            }
        </div>
      <div className="col-9">
        {page === 4 && (
          <FormDisplay
            inputFields={postInputFields.filter((f) => f.pageNumber === 4)}
            pageLayoutColumns={1}
            pageMessage={pageMessage}
            pageNumber={1}
          />
        )}

        {page === 5 && (
          <div className="row">
            
            <div className="col-sm-3">
            <div className="img-responsive text-center">
                <img src={post.media?.mediaUrl ?? defaultPostImageUrl} className="img-fluid" />
            </div>
            </div>
            <div className="col-sm-6">
            <FormDisplay
            inputFields={postInputFields.filter((f) => f.pageNumber === 5)}
            pageLayoutColumns={2}
            pageMessage={pageMessage}
            pageNumber={2}
          />
            </div>
            
          </div>
        )}

        {page === 6 && (
          <div className="row">
            
            <div className="col-6">
            <DisplayMediaFiles
              selectedFiles={post.attachment ? post.attachment : []}
              deleteFile={deletePostMediaFiles}
              mediaOwnerId={post.user?._id}
              />
            </div>
            <div className="col-6">
            <FormDisplay
            inputFields={postInputFields.filter((f) => f.pageNumber === 6)}
            pageLayoutColumns={2}
            pageMessage={pageMessage}
            pageNumber={2}
          />
            </div>
            
          </div>
        )}
      </div>
      <div className="row">
        <div className="col-4">
          <button
            className="w-100 btn btn-primary"
            onClick={() => setPage(page === 1 ? 1 : page - 1)}
          >
            {page === 4 ? "start" : "Previos"}
          </button>
        </div>
        <div className="col-4">
          <button
            className="w-100 btn"
            onClick={() => {
              submitPost();
            }}
          >
            save
          </button>
        </div>
        <div className="col-4">
          <button
            className="w-100 btn btn-primary"
            onClick={() => setPage(page + 1)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
