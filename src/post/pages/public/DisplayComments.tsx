import { useState } from "react";
import { defaultUserImageUrl } from "../../../user/contexts/api/user";
import { IPostCommentDTO } from "../../typings/post"
import { CreateComment } from "./CreateComment";
import { useNavigate } from "react-router-dom";
import { DisplayMediaFiles } from "../../../generics/file/components/DisplayMediaFiles";
import { IMedia } from "../../../generics/file/typings/media";
import { deletePostAttachmentFiles } from "../../contexts/post";
import { toast } from "react-toastify";
import { IDeleteAttachmentFilesDTO } from "../../../generics/typings/typngs";
import { PostComment } from "./PostComment";

export interface IDisplayCommentsProp {
    comments: IPostCommentDTO[];
}
export const DisplayComments = (prop: IDisplayCommentsProp) => {
    const navigate = useNavigate();
    const localUserString = localStorage.getItem("user");
    const localUser = JSON.parse(`${localUserString}`);
    
    const [editComment, setEditComment] = useState("");

    return (
        <div className="row">
            {
                prop.comments.length > 0 ? (
                    <div className="row">
                        {
                            prop.comments.map((comment) => (
                                <PostComment comment={comment} />
                            ))
                        }
                    </div>
                ) : (
                    <div className="col-12">
                        <h3>No Comments</h3>
                    </div>
                )
            }
        </div>
    )
}