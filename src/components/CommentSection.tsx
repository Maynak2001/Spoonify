import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Reply, Send, Trash2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { Comment } from '../types';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  recipeId: string;
}

const CommentItem: React.FC<{ 
  comment: Comment; 
  isReply?: boolean;
  user: any;
  replyingTo: string | null;
  replyTexts: {[key: string]: string};
  setReplyingTo: (id: string | null) => void;
  setReplyTexts: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  toggleLike: (id: string) => void;
  submitReply: (id: string) => void;
  deleteComment: (id: string) => void;
}> = ({ comment, isReply = false, user, replyingTo, replyTexts, setReplyingTo, setReplyTexts, toggleLike, submitReply, deleteComment }) => (
  <div className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
    <div className="flex items-start space-x-3 mb-3">
      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-primary-600 font-medium text-sm">
          {(comment.user_profile?.full_name || comment.user_profile?.email)?.charAt(0) || 'U'}
        </span>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-gray-900">
            {comment.user_profile?.full_name || comment.user_profile?.email?.split('@')[0] || 'User'}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-700 mb-2">{comment.content}</p>
        
        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={() => toggleLike(comment.id)}
            className={`flex items-center space-x-1 ${
              comment.user_liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            } transition-colors`}
          >
            <Heart className={`h-4 w-4 ${comment.user_liked ? 'fill-current' : ''}`} />
            <span>{comment.likes_count || 0}</span>
          </button>
          
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary-500 transition-colors"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
          )}
          
          {user && user.id === comment.user_id && (
            <button
              onClick={() => deleteComment(comment.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          )}
        </div>

        {replyingTo === comment.id && (
          <div className="mt-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={replyTexts[comment.id] || ''}
                onChange={(e) => setReplyTexts(prev => ({...prev, [comment.id]: e.target.value}))}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                onKeyPress={(e) => e.key === 'Enter' && submitReply(comment.id)}
                autoFocus
              />
              <button
                onClick={() => submitReply(comment.id)}
                disabled={!replyTexts[comment.id]?.trim()}
                className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {comment.replies && comment.replies.length > 0 && (
      <div className="mt-3">
        {comment.replies.map((reply) => (
          <CommentItem 
            key={reply.id} 
            comment={reply} 
            isReply={true}
            user={user}
            replyingTo={replyingTo}
            replyTexts={replyTexts}
            setReplyingTo={setReplyingTo}
            setReplyTexts={setReplyTexts}
            toggleLike={toggleLike}
            submitReply={submitReply}
            deleteComment={deleteComment}
          />
        ))}
      </div>
    )}
  </div>
);

const CommentSection: React.FC<CommentSectionProps> = ({ recipeId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    try {
      // Get all comments
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user profiles
      const userIds = commentsData?.map(c => c.user_id) || [];
      const { data: usersData } = await supabase
        .from('user_profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      // Get likes for all comments
      const commentIds = commentsData?.map(c => c.id) || [];
      const { data: likesData } = await supabase
        .from('comment_likes')
        .select('comment_id, user_id')
        .in('comment_id', commentIds);

      // Group comments and replies
      const commentsMap = new Map();
      const rootComments: Comment[] = [];

      commentsData?.forEach(comment => {
        const userProfile = usersData?.find(u => u.id === comment.user_id);
        const commentLikes = likesData?.filter(l => l.comment_id === comment.id) || [];
        
        const commentWithData = {
          ...comment,
          user_profile: userProfile,
          likes_count: commentLikes.length,
          user_liked: user ? commentLikes.some(l => l.user_id === user.id) : false,
          replies: []
        };

        commentsMap.set(comment.id, commentWithData);

        if (!comment.parent_id) {
          rootComments.push(commentWithData);
        }
      });

      // Add replies to parent comments
      commentsData?.forEach(comment => {
        if (comment.parent_id && commentsMap.has(comment.parent_id)) {
          const parentComment = commentsMap.get(comment.parent_id);
          const replyComment = commentsMap.get(comment.id);
          parentComment.replies.push(replyComment);
        }
      });

      setComments(rootComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      await supabase
        .from('comments')
        .insert({
          recipe_id: recipeId,
          user_id: user.id,
          content: newComment.trim()
        });

      setNewComment('');
      fetchComments();
      toast.success('Comment added');
    } catch (error) {
      toast.error('Error adding comment');
    }
  };

  const submitReply = async (parentId: string) => {
    const replyText = replyTexts[parentId] || '';
    if (!user || !replyText.trim()) return;

    try {
      await supabase
        .from('comments')
        .insert({
          recipe_id: recipeId,
          user_id: user.id,
          content: replyText.trim(),
          parent_id: parentId
        });

      setReplyTexts(prev => ({...prev, [parentId]: ''}));
      setReplyingTo(null);
      fetchComments();
      toast.success('Reply added');
    } catch (error) {
      toast.error('Error adding reply');
    }
  };

  const toggleLike = async (commentId: string) => {
    if (!user) {
      toast.error('Please sign in to like comments');
      return;
    }

    try {
      const comment = comments.find(c => c.id === commentId) || 
                    comments.flatMap(c => c.replies || []).find(r => r.id === commentId);
      
      if (!comment) return;

      if (comment.user_liked) {
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: user.id });
      }

      fetchComments();
    } catch (error) {
      toast.error('Error updating like');
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      fetchComments();
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Error deleting comment');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
        <MessageCircle className="h-5 w-5" />
        <span>Comments ({comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)})</span>
      </h2>

      {user && (
        <form onSubmit={submitComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this recipe..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="mt-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Comment
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment}
            user={user}
            replyingTo={replyingTo}
            replyTexts={replyTexts}
            setReplyingTo={setReplyingTo}
            setReplyTexts={setReplyTexts}
            toggleLike={toggleLike}
            submitReply={submitReply}
            deleteComment={deleteComment}
          />
        ))}
        
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;