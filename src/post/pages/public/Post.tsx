import { ChangeEvent, DetailedHTMLProps, FormEvent, TextareaHTMLAttributes, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IPostCommentDTO, IPostDTO } from "../../typings/post";

import { ITextInput } from "../../../generics/components/form/TextInput";
import {
  ISelectOption,
  ISelectProp,
} from "../../../generics/components/form/Select";
import { IDatePickerInputProp } from "../../../generics/components/form/DatePicker";
import {
  addOrRemoveEntityFromGroup,
    createPost,
  defaultPostImageUrl,
  deletePostAttachmentFiles,
  getPost,
  getPostComments,
  updatePost,
} from "../../../post/contexts/post";
import { getClusters } from "../../../cluster/contexts/cluster";
import { IClusterDTO } from "../../../cluster/typings/cluster";
import { toast } from "react-toastify";
import {
  IFileAndObjectUrl,
  IMultipleFilesProps,
} from "../../../generics/file/components/MultipleFiles";
import {
  deleteFile,
  selectMultipleFiles,
  uploadFiles,
} from "../../../generics/file/utils/filehooks";
import {
  FormDisplay,
  IInputFieldWithPageNumber,
} from "../../../generics/components/form/FormDisplay";
import { IMedia } from "../../../generics/file/typings/media";
import { DisplayMediaFiles } from "../../../generics/file/components/DisplayMediaFiles";
import { IAddOrRemoveFromGroupDTO, IDeleteAttachmentFilesDTO, IGenericResponse, QueryReturn } from "../../../generics/typings/typngs";
import { defaultUserImageUrl } from "../../../user/contexts/api/user";
import { DisplayComments } from "./DisplayComments";
import { CreateComment } from "./CreateComment";
import { ComponentModal } from "../../../generics/components/modals/ComponentModal";
import { useModalContextStore } from "../../../generics/components/modals/ModalContextProvider";
import { PeopleFromEntity } from "../../../user/pages/People";

export const Post = () => {
  const navParam = useParams();
  const postId = navParam.postId;
  const navigate = useNavigate();
  
  const {setLoader} = useModalContextStore()
  
  const localUserString = localStorage.getItem("user");
  const localUser = localUserString ? JSON.parse(localUserString) : null;

  const [post, setPost] = useState({} as IPostDTO);
  const [pageMessage, setPageMessage] = useState(
    {} as { [key: string]: string }
  );
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[]);
  const [selectedAttachmentFiles, setSelectedAttachmentFiles] = useState([] as IFileAndObjectUrl[]);

  const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const [postComments, setPostComments] = useState({} as QueryReturn<IPostCommentDTO> );
  const [_page, set_Page] = useState(1);
  const [commentQueryPayload, setCommentQueryPayload] = useState({socialpost: postId, _page: 1, _orderBy: "createdAt", _order: "DESC"} as {[key: string]: string | number} )

  useEffect(() => {
    (
      async () => {
        try{
          setLoader({showLoader: true, loaderText: "getting comments"});
          const postCommentsRes = await getPostComments(commentQueryPayload)
          setPostComments(postCommentsRes);
          setLoader({showLoader: false, loaderText: ""});
        }catch(error){
          setLoader({showLoader: false, loaderText: ""});
          toast.error((error as any).message)
        }
      }
    )()
  }, [commentQueryPayload])


  const [page, setPage] = useState(1);
  const [tabs, setTabs] = useState([
    {
      pageNumber: 1,
      label: "Post Details",
      iconClass: "fa fa-vcard"
    },
    {
      pageNumber: 2,
      label: "Attached Files",
      iconClass: "fa fa-folder-open"
    },

    {
      pageNumber: 3,
      label: "Post Comments",
      iconClass: "fa fa-chats"
    },
  ] as { pageNumber: number; label: string, iconClass: string; }[]);
  

  
  const deletePostMediaFiles = async (fileUrls: string[]) => {
    try{
      const payload: IDeleteAttachmentFilesDTO = {
        attachmentUrls: fileUrls,
        primaryId: `${post._id}`,
        fromFeature: "post",
      };
      setLoader({showLoader: true, loaderText: "deleting attachment files"});
      await deletePostAttachmentFiles(payload);
      
      setLoader({showLoader: false, loaderText: ""});
      toast.success("post attachments deleted");
      setPost((prev) => ({
        ...post,
        attachment: prev.attachment?.filter(
          (at) => !fileUrls.includes(at.mediaUrl)
        ),
      }));
      setLoader({showLoader: false, loaderText: ""})
    }catch(error){
      setLoader({showLoader: false, loaderText: ""})
      toast.error((error as IGenericResponse<unknown>).message)
    }
  };

  
  const [isLikingPost, setIsLikingPost] = useState(false);
const {setShowModalText} = useModalContextStore()
const [noOfLikes, setNoOfLikes] = useState(post?.noOfLikes ?? 0) 
const addOrRemoveFromComment = async (
    payload: IAddOrRemoveFromGroupDTO<string>
  ) => {
    try {
      setNoOfLikes(payload.forwardAction ? noOfLikes + 1 : noOfLikes - 1);
      setIsLikingPost(!isLikingPost);
      await addOrRemoveEntityFromGroup(payload, "post");
    } catch (error) {
      toast.error((error as any).message);
    }
  };


  useEffect(() => {
    (async () => {
    try{
      setLoader({showLoader: true, loaderText: "getting post"})
      const postRes = await getPost(`${postId}`);
      setPost(postRes);
      setNoOfLikes(postRes.noOfLikes ?? 0)
      const isInPostLikedBy = postRes.likedBy?.includes(localUser.userId);
      setIsLikingPost(isInPostLikedBy ?? false)
    
      setLoader({showLoader: false, loaderText: ""})
    }catch(error){
      setLoader({showLoader: false, loaderText: ""})
      toast.error((error as IGenericResponse<unknown>).message)
    }
    })();
  }, []);

  return (
    <div className="row">
      <div className="col-2">
        
      {localUser &&
              `${localUser?.userId}` === `${post.user?._id}` && (
                <div className="text-right">
                  <span
                    className="btn d-6 fas fas-edit"
                    onClick={() => {
                      navigate(`/post/create/${postId}`)
                    }}
                  ></span>
                </div>
              )}
        {tabs.map((tab, i, tabsArray) => (
          <div
            key={`div${i}`}
            className={`text-center ${
              page === tab.pageNumber
                ? "bg-light text-dark"
                : "bg-dark text-light"
            }`}
          >
            <div 
            className=""
            role="button"
            aria-label={tab.label}
            onClick={() => setPage(tab.pageNumber)}
            >
              
            {tab.pageNumber === 1 || tab.pageNumber === 5 ? (
              <img
                src={post?.media?.mediaUrl}
                className="w-100 img-fluid img-responsive"
                alt="post"
              />
            ) : (
              <span className="d1">{tab.pageNumber}</span>
            )}
            <br />
            <span
              className={`${tab.iconClass}`}
            >
            </span>
            </div>
          </div>
        ))}
      </div>

      <div className="col-10">
        <div className="col-12">
          {page === 1 && (
            <div className="">
              <h1>{post.title}</h1>
              <div className="row">
                <div className="col-10">
                <h6>
                <img src={post.user?.avatar ?? defaultUserImageUrl} alt="user" className="img-avatar img-fluid" />
                    <span
                    className="font-weight-bold"
                    role="button"
                    onClick={() => navigate(`/user/profile/${post.user?._id ?? localUser.userId}`)}
                    >
                     {post.user?.firstName}, {post.user?.lastName}   
                    </span>
                    | {post.datePublished} 
                    | <i className="mx-2 fa fa-comment"></i> 
                    <span className="mx-2">{post.noOfComments ?? 0}</span>
                    
                    | <i className="fa fa-eye"></i> 
                    <span className="mx-2">{post.noOfViews ?? 0}</span>
                    
                    |
              <span
                className={`mx-2 fa ${
                  isLikingPost ? "fa-heart" : "fa-heart-o"
                }`}
                role="button"
                onClick={() =>
                  addOrRemoveFromComment({
                    primaryId: `${post._id}`,
                    propertyName: "likedBy",
                    propertyValue: `${localUser.userId}`,
                    forwardAction: !isLikingPost,
                    primaryIncrementField: "noOfLikes"
                  })
                }
              ></span>
              <span>{isLikingPost ? "unlike" : "like"}</span>
              <span
              className="fas fas-users mx-2"
              role="button"
              onClick={() => setShowModalText(`showPostUsers${post._id}`)}
              >{noOfLikes}</span>
                </h6>
              </div>
              </div>
              <div className="img-responsive text-right">
                <img src={post.media?.mediaUrl ?? defaultPostImageUrl} alt="" className="col-4"/>
            </div>
            <div className="">
                {post.content}
            </div>
            </div>
          )}
          {page === 2 && (
            <div className="table table-responsive table-stripped table-dark">
              <DisplayMediaFiles
              selectedFiles={post.attachment ? post.attachment : []}
              deleteFile={deletePostMediaFiles}
              mediaOwnerId={post.user?._id}
              />
            </div>
          )}

{
  page === 3 && (
    <div>
      
    <DisplayComments
    comments={postComments.docs}
    />

    <div className="row">
      <div className="col-12">
        <CreateComment
        intent="create"
        content=""
        postId={`${post._id}`}

        />
      
      </div>
    </div>
    <div className="row">
    <div 
      className="col-6 btn"
      role="button"onClick={() => {
        set_Page(_page - 1);
        setCommentQueryPayload({...commentQueryPayload, _page: _page - 1})}
      }
      >
        Previous
      </div><div 
      className="col-6 btn"
      role="button"
      onClick={() => {
        set_Page(_page + 1);
        setCommentQueryPayload({...commentQueryPayload, _page: _page + 1})}
      }
      >
        Next
      </div>
    </div>
    </div>
  )
}

        </div>
      </div>
      
      <ComponentModal
       showModalText={`showPostUsers${post._id}`}
       modalBody={
       <PeopleFromEntity
        basePrimaryId={`${post._id}`}
        fromFeature="post"
        baseEntity="post"
        arrayPropertyName="likedBy"
        _page={1}
        _limit={10}
        />
       }
       />
    </div>
  );
};
