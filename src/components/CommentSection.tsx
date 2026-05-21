import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Trash2, Loader } from 'lucide-react';
import { getComments, addComment, deleteComment } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  recipeId: string;
}

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const CommentSection: React.FC<CommentSectionProps> = ({ recipeId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await getComments(recipeId);
      setComments(data || []);
    } catch {
      console.error('Error fetching comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;
    setSubmitting(true);
    try {
      await addComment({ recipeId, content: newComment.trim() });
      setNewComment('');
      fetchComments();
      toast.success('Comment added');
    } catch {
      toast.error('Error adding comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch {
      toast.error('Error deleting comment');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-amber-500" />
        Comments
        <span className="text-sm font-normal text-gray-400 dark:text-gray-500">({comments.length})</span>
      </h2>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-none text-sm transition-all"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as any);
              }}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            >
              {submitting ? <Loader className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
              Post
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 ml-1">Ctrl+Enter to post</p>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader className="h-5 w-5 animate-spin text-amber-500" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-10 w-10 text-gray-200 dark:text-gray-700 mx-auto mb-2" />
            <p className="text-sm text-gray-400 dark:text-gray-500">No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const initial = (comment.userId?.username || 'U').charAt(0).toUpperCase();
            const isOwner = user && (user.id === (comment.userId?._id || comment.userId));
            return (
              <div key={comment._id} className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center flex-shrink-0 text-amber-700 dark:text-amber-400 font-bold text-sm">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      {comment.userId?.username || 'User'}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="mt-1.5 flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommentSection;
