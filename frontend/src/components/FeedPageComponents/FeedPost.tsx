import { useSelector } from "react-redux";
import type { FeedPostType } from "../../types/feed";
import type { RootState } from "../../store/store";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { toggleLikePost } from "../../api/like.api";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  createComment,
  getCommentsByPostId,
  deleteComment,
} from "../../api/comment.api";
import type { CommentType } from "../../types/comment";
import Spinner from "../General/Spinner";
import HlsVideoPlayer from "../General/HlsVideoPlayer";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/Card";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface FeedPostProps {
  post: FeedPostType;
}

const FeedPost = ({ post }: FeedPostProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [likes, setLikes] = useState<string[]>(post.likes);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState<number>(post.commentsCount);
  const [expanded, setExpanded] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

  const isLikedByMe = user ? likes.includes(user._id) : false;

  const handleToggleLike = async () => {
    if (!user) {
      toast.error("Please login to like the post");
      return;
    }

    try {
      setLoading(true);

      if (isLikedByMe) {
        setLikes((prev) => prev.filter((id) => id !== user._id));
        setLikeCount((prev) => prev - 1);
      } else {
        setLikes((prev) => [...prev, user._id]);
        setLikeCount((prev) => prev + 1);
      }

      await toggleLikePost(post._id);
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle like");
      if (isLikedByMe) {
        setLikes((prev) => [...prev, user._id]);
        setLikeCount((prev) => prev + 1);
      } else {
        setLikes((prev) => prev.filter((id) => id !== user._id));
        setLikeCount((prev) => prev - 1);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const data = await getCommentsByPostId(post._id);
      setComments(data);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
    if (!showComments) fetchComments();
  };

  const handleAddComment = async () => {
    if (!user) return toast.error("Login to comment");
    if (!commentText.trim()) return toast.error("Comment cannot be empty");

    try {
      const newComment = await createComment(post._id, commentText);
      setComments((prev) => [newComment, ...prev]);
      setCommentsCount((prev) => prev + 1);
      setCommentText("");
      toast.success("Comment posted");
    } catch (error: any) {
      toast.error(error.message || "Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(post._id, commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCommentsCount((prev) => prev - 1);
      toast.success("Comment deleted");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete comment");
    }
  };

  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      setIsOverflowing(element.scrollHeight > element.clientHeight);
    }
  }, [post.content]);

  return (
    <Card className="w-full mb-6 border-b sm:border-border sm:border bg-background sm:bg-card shadow-none sm:shadow-sm pb-4 sm:pb-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 px-4 pt-4 sm:px-6">
        <Link to={`/profile/${post.owner.username}`}>
          <Avatar src={post.owner.profileImage} alt={post.owner.username} />
        </Link>
        <div className="flex flex-col">
          <Link to={`/profile/${post.owner.username}`} className="font-semibold hover:underline">
            {post.owner.username}
          </Link>
          <span className="text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleString(undefined, {
              dateStyle: "medium", timeStyle: "short"
            })}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 pb-2 space-y-4">
        {post.image && (
          <Link to={`/${post._id}`} className="block overflow-hidden rounded-xl border">
            <img
              src={post.image.url}
              alt="post"
              className="w-full h-auto object-cover max-h-[600px] hover:scale-[1.01] transition-transform duration-300"
            />
          </Link>
        )}

        {post.video?.url && (
          <div className="w-full overflow-hidden rounded-xl border bg-black aspect-video flex items-center justify-center">
            <HlsVideoPlayer src={post.video.url} />
          </div>
        )}

        {post.content && (
          <div className="relative">
            <div
              ref={contentRef}
              className={`prose prose-invert max-w-none text-foreground/90 transition-all duration-300 prose-p:my-1 prose-a:text-primary hover:prose-a:underline ${expanded ? "" : "line-clamp-3 overflow-hidden"}`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            {isOverflowing && (
              <button
                onClick={() => setExpanded((prev) => !prev)}
                className="mt-1 text-sm text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-stretch px-4 sm:px-6 pb-4 pt-0 gap-4">
        <div className="flex items-center gap-6 pt-2">
          <button
            disabled={loading}
            onClick={handleToggleLike}
            className="flex items-center gap-2 text-muted-foreground hover:text-rose-500 disabled:opacity-50 transition-colors group cursor-pointer"
          >
            <Heart
              size={22}
              className={`transition-transform group-hover:scale-110 ${isLikedByMe ? "fill-rose-500 text-rose-500" : ""}`}
            />
            <span className="text-sm font-medium text-foreground">{likeCount}</span>
          </button>

          <button
            onClick={handleToggleComments}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors group"
          >
            <MessageCircle size={22} className="transition-transform group-hover:scale-110" />
            <span className="text-sm font-medium text-foreground">{commentsCount}</span>
          </button>
        </div>

        {showComments && (
          <div className="space-y-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
            {loadingComments ? (
              <div className="flex justify-center p-4">
                <Spinner />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-2">No comments yet</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => {
                  const isPostOwner = user?._id === post.owner._id;
                  const isCommentOwner = user?._id === comment.commentedBy._id;
                  const canDelete = isPostOwner || isCommentOwner;

                  return (
                    <div key={comment._id} className="flex items-start gap-3 group">
                      <Avatar 
                        src={comment.commentedBy.profileImage || undefined} 
                        alt={comment.commentedBy.username}
                        className="w-8 h-8 mt-1"
                      />
                      <div className="flex-1 bg-muted/30 rounded-2xl rounded-tl-none px-4 py-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <Link to={`/profile/${comment.commentedBy.username}`}>
                            <span className="text-sm font-semibold hover:underline">
                              {comment.commentedBy.username}
                            </span>
                          </Link>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete comment"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-foreground/90 mt-0.5">
                          {comment.comment}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex gap-2 pt-2 items-center">
              <Avatar src={user?.profileImage} alt={user?.username} className="w-8 h-8 hidden sm:block" />
              <Input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddComment();
                }}
                className="flex-1 rounded-full bg-muted/50 focus-visible:bg-background"
                placeholder="Write a comment..."
              />
              <Button
                onClick={handleAddComment}
                className="rounded-full px-6"
                disabled={!commentText.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default FeedPost;
