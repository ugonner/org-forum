import { FormEvent, useState } from "react";
import { IPostCommentDTO } from "../../typings/post";
import { DisplayMultipleFiles } from "../../../generics/file/components/DisplayMultipleFiles";
import { deleteFile, selectMultipleFiles, uploadFiles } from "../../../generics/file/utils/filehooks";
import { IFileAndObjectUrl } from "../../../generics/file/components/MultipleFiles";
import { toast } from "react-toastify";
import { IMedia } from "../../../generics/file/typings/media";
import { createPostComment, updatePostComment } from "../../contexts/post";
export interface IPostCommentProp {
  postId: string;
  postCommentId?: string;
  intent: "create" | "edit";
  content?: string;
}
export const CreateComment = (prop: IPostCommentProp) => {
  const [comment, setComment] = useState({
    content: prop.content ?? "",
    socialpost: prop.postId
  } as IPostCommentDTO);
  const [selectedFiles, setSelectedFiles] = useState([] as IFileAndObjectUrl[]);
 
  const submitPostComment = async () => {
    try{
        if(selectedFiles.length > 0){
            const uploadedFilesRes = await uploadFiles({} as FormEvent<HTMLFormElement>, selectedFiles);
            if(uploadedFilesRes && uploadedFilesRes.length > 0){
                const attachment: IMedia[] = [];
                uploadedFilesRes.forEach((file) => {
                    const media: IMedia = {
                        mediaId: file.id,
                        mediaSecureUrl: `${file.secureUrl}`,
                        mediaType: file.fileType,
                        mediaUrl: `${file.url}`
                    };
                    attachment.push(media);
                })
                comment.attachment = attachment;
            }
        }
        prop.intent === "edit" && prop.postCommentId ? await updatePostComment({...comment, commentId: prop.postCommentId}) : await createPostComment(comment);

    }catch(error){
        toast.error((error as any).message)
    }
}
  return (
    <div className="form-group">
      <DisplayMultipleFiles
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        deleteFile={deleteFile}
      />
      <div className="row">
        
      <div className="col-1">
            <input 
            type="file" 
            hidden={true} 
            id="postcomment-file"
            onChange={(e) => selectMultipleFiles(e, setSelectedFiles)}
            />
            <span 
            className="btn fas fas-attachment" 
            role="button" 
            aria-label="click to select media to post"
            onClick={() => document.getElementById("postcomment-file")?.click()}
            ></span>
        </div>
        <div className="col-10">
          <textarea
            name="content"
            className="w-100"
            placeholder="Add Your Comment"
            cols={10}
            onChange={(e) =>
              setComment({ ...comment, content: e.target.value })
            }
          >
            {comment.content}
          </textarea>
        </div>

            
        <div className="col-1">
            <span 
            className="btn fas fas-send" 
            role="button" 
            aria-label="upload comment"
            onClick={() => submitPostComment()}
            ></span>
        </div>
      </div>
    </div>
  );
};
