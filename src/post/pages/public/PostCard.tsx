import { Link, useNavigate } from "react-router-dom";
import { IPostDTO } from "../../typings/post";
import { defaultPostImageUrl } from "../../contexts/post";
import { ICategoryDTO, IUpdateCategoryDTO } from "../../../category/typings/category";
import { defaultUserImageUrl } from "../../../user/contexts/api/user";

export interface IPostCardProp {
  post: IPostDTO;
  linkToPostPage: boolean;
  stackPostImage?: boolean
}

export const PostCard = (prop: IPostCardProp) => {
  const navigate = useNavigate();
  const datePublished = prop.post.datePublished ?? new Date().toISOString();
  const postDate = new Date(datePublished);
  const postYear = postDate.getFullYear();
  const postMonth = `${postDate.getUTCMonth()}`.padStart(2, "0");
  const postDay = `${postDate.getUTCDay()}`.padStart(2, "0");

  return (
    <div className="col-12">
      <div className="row my-3 thubnail">
        <div className="col-12">
          <p className="">
            <img 
            src={prop.post?.user?.avatar ?? defaultUserImageUrl}
            className=" mx-3 img-avatar rounded"
            role="button"
            alt="author's image"
            onClick={() => navigate(`/user/profile/${prop.post.user?._id}`)}
           />
            <span 
            className="fs-6 font-weight-bold py-4 bg-info text-white"
            role="button"
            onClick={() => navigate(`/post/posts/?categorys=${(prop.post?.categorys as IUpdateCategoryDTO[])[0]?._id }`)}
            >
              {(prop.post?.categorys as ICategoryDTO[])[0]?.categoryName}
            </span>
          </p>
        </div>
        <div className={prop.stackPostImage ? "col-12 img-responsive" : "col-5 img-responsive"}>
          <img
            src={prop.post.media?.mediaUrl ?? defaultPostImageUrl}
            alt="Image"
            className="img-fluid"
          />
        </div>
        <div className={prop.stackPostImage ? "col-12" : "col-7"}>
          <span 
          className="d5 font-weight-bold"
          role="button"
          onClick={() => navigate(`/post/view/${prop.post._id}`)}
          >
            {prop.post.title}
          </span>
          <p className="d6">{`${prop.post.content}`.substr(0, 70)}</p>
          <p className="d6">
            <span className="fa fa-eye"></span>
            <span className="mx-2">{prop.post.noOfViews}</span>

            <span className="fa fa-comment"></span>
            <span className="mx-2">{prop.post.noOfComments}</span>
            

            <span className="fa fa-heart"></span>
            <span className="mx-2">{prop.post.noOfLikes}</span>
          </p>
          <p className="text-right">
            <span className="fs-6">{postYear}</span>
            <span className="fs-3">.{postMonth}</span>
            <span className="fs-1 font-weight-bolder">.{postDay}</span>
          </p>
          
        </div>
      </div>
    </div>
  );
};
