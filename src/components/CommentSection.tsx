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
    <div className="bg-[#111] rounded-2xl border border-white/[0.06] p-5">
      <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-[#d4a843]" />
        Comments
        <span className="text-sm font-normal text-gray-600">({comments.length})</span>
      </h2>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this recipe..."
              className="w-full px-4 py-3 border border-white/[0.08] rounded-xl bg-white/[0.03] text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#d4a843]/20 focus:border-[#d4a843]/50 resize-none text-sm transition-all"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as any);
              }}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-[#d4a843] hover:bg-[#e0b855] disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
            >
              {submitting ? <Loader className="h-3 w-3 animate-spin text-black" /> : <Send className="h-3 w-3" />}
              Post
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 ml-1">Ctrl+Enter to post</p>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader className="h-5 w-5 animate-spin text-[#d4a843]" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-10 w-10 text-white/10 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No comments yet. Be the first!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const initial = (comment.userId?.username || 'U').charAt(0).toUpperCase();
            const isOwner = user && (user.id === (comment.userId?._id || comment.userId));
            return (
              <div key={comment._id} className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-full bg-[#d4a843]/10 border border-[#d4a843]/15 flex items-center justify-center flex-shrink-0 text-[#d4a843] font-bold text-sm">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm text-white">
                      {comment.userId?.username || 'User'}
                    </span>
                    <span className="text-xs text-gray-600">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{comment.content}</p>
                  {isOwner && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="mt-1.5 flex items-center gap-1 text-xs text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
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
