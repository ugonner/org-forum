import { useEffect, useState } from "react";
import { IPostCommentDTO } from "../../typings/post";
import { defaultUserImageUrl } from "../../../user/contexts/api/user";
import { useNavigate } from "react-router-dom";
import { DisplayMediaFiles } from "../../../generics/file/components/DisplayMediaFiles";
import { IMedia } from "../../../generics/file/typings/media";
import {
  addOrRemoveEntityFromGroup,
  deletePostAttachmentFiles,
} from "../../contexts/post";
import {
  IAddOrRemoveFromGroupDTO,
  IDeleteAttachmentFilesDTO,
} from "../../../generics/typings/typngs";
import { toast } from "react-toastify";
import { CreateComment } from "./CreateComment";
import { ComponentModal } from "../../../generics/components/modals/ComponentModal";
import { PeopleFromEntity } from "../../../user/pages/People";
import { useModalContextStore } from "../../../generics/components/modals/ModalContextProvider";
export interface ICommentProp {
  comment: IPostCommentDTO;
}
export const PostComment = (prop: ICommentProp) => {
  const {setShowModalText} = useModalContextStore();
    const localUserString = localStorage.getItem("user");
  const localUser = JSON.parse(localUserString as string);
  const [comment, setComment] = useState(prop.comment as IPostCommentDTO);
  const navigate = useNavigate();
  const [editComment, setEditComment] = useState(false);
  const [noOfLikes, setNoOfLikes] = useState(prop.comment.noOfLikes ?? 0);
  const [isLikingComment, setIsLikingComment] = useState(false);

  useEffect(() => {
    const isLiking = comment.likedBy?.includes(`${localUser.userId}`);
    setIsLikingComment(isLiking as boolean);
  }, []);

  const deletePostCommentAttachemets = async (
    commentId: string,
    mediaUrls: string[]
  ) => {
    try {
      const payload: IDeleteAttachmentFilesDTO = {
        primaryId: commentId,
        fromFeature: "comment",
        attachmentUrls: mediaUrls,
      };
      await deletePostAttachmentFiles(payload);
    } catch (error) {
      toast.error((error as any).message);
    }
  };

  const addOrRemoveFromComment = async (
    payload: IAddOrRemoveFromGroupDTO<string>
  ) => {
    try {
      setNoOfLikes(payload.forwardAction ? noOfLikes + 1 : noOfLikes - 1);
      setIsLikingComment(!isLikingComment);
      await addOrRemoveEntityFromGroup(payload, "comment");
    } catch (error) {
      toast.error((error as any).message);
    }
  };

  return (
    <div className="row">
      <div className="col-3 img-responsive">
        <img
          src={comment.user?.avatar ?? defaultUserImageUrl}
          alt="user's image"
          className="img-fluid"
        />
      </div>
      <div className="col-9">
        <h5
          role="button"
          onClick={() => navigate(`/user/profile/${comment.user?._id}`)}
        >
          {comment.user?.firstName ?? ""}, {comment.user?.lastName ?? ""}
        </h5>
        <div className="row">
          <div className="col-11">
            <p className="d6">
              {comment.content}
              <br />
              <span
                className={`btn fas ${
                  isLikingComment ? "fas-heart" : "fas-heart-0"
                }`}
                role="button"
                onClick={() =>
                  addOrRemoveFromComment({
                    primaryId: `${comment._id}`,
                    propertyName: "likedBy",
                    propertyValue: `${localUser.userId}`,
                    forwardAction: !isLikingComment,
                    primaryIncrementField: "noOfLikes"
                  })
                }
              >{isLikingComment ? "unlike" : "like"}
              </span>
              <span
              className="fas fas-users mx-2"
              role="button"
              onClick={() => setShowModalText(`showComment${comment._id}`)}
              >{noOfLikes}</span>
            </p>
            <DisplayMediaFiles
              selectedFiles={(comment.attachment as IMedia[]) ?? []}
              mediaOwnerId={comment.user?._id}
              deleteFile={(mediaUrls: string[]) =>
                deletePostCommentAttachemets(`${comment._id}`, mediaUrls)
              }
            />
          </div>
          {localUser.userId == comment.user?._id && (
            <div className="col-1">
              <span
                className="fas fas-create"
                role="button"
                onClick={() => setEditComment(!editComment)}
              >
                o
              </span>
            </div>
          )}
        </div>
        {editComment && (
          <CreateComment
            postId={`${comment.socialpost}`}
            intent="edit"
            postCommentId={`${comment._id}`}
            content={`${comment.content}`}
          />
        )}
      </div>
      <ComponentModal
       showModalText={`showComment${comment._id}`}
       modalBody={
       <PeopleFromEntity
        basePrimaryId={`${comment._id}`}
        fromFeature="post"
        baseEntity="comment"
        arrayPropertyName="likedBy"
        _page={1}
        _limit={10}
        />
    }
       />
      

    </div>
  );
};
