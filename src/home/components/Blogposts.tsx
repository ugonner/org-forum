import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IGenericResponse, QueryReturn } from "../../generics/typings/typngs";
import { IPostDTO } from "../../post/typings/post";
import { toast } from "react-toastify";
import { getPosts } from "../../post/contexts/post";
import { PostCard } from "../../post/pages/public/PostCard";

export const BlogPosts: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState({} as QueryReturn<IPostDTO>);
  useEffect(() => {
    (async () => {
      try {
        const postsRes = await getPosts({
          _limit: 6,
          _page: 1,
          _orderBy: "datePublished",
          _order: "DESC",
        });
        setPosts(postsRes);
      } catch (error) {
        toast.error((error as IGenericResponse<unknown>).message);
      }
    })();
  }, []);
  return (
    <>
      {/* Start Blog Section */}
      <div className="blog-section">
        <div className="container">
          <div className="row mb-5">
            <div className="col-md-6">
              <h2 className="section-title">Recent Activities</h2>
            </div>

            <div className="col-md-6 text-start text-md-end">
              <span
                role="button"
                className="more"
                onClick={() => navigate(`/post/posts`)}
              >
                View All Posts
              </span>
            </div>
          </div>

          {posts.docs?.length > 0 && (
            <div className="row">
              {posts.docs?.map((post) => (
                <div className="col-sm-4">
                  <PostCard post={post} linkToPostPage={true} stackPostImage={true} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* End Blog Section */}
    </>
  );
};
