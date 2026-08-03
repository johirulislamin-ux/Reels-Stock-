import React, { useState } from 'react';
import { VideoItem, Comment, Creator } from '../types';
import { X, Send, Heart, CheckCircle2 } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface CommentsModalProps {
  video: VideoItem | null;
  currentUser: Creator;
  onClose: () => void;
  onAddComment: (videoId: string, commentText: string) => void;
  onLikeComment?: (videoId: string, commentId: string) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  video,
  currentUser,
  onClose,
  onAddComment,
  onLikeComment,
}) => {
  const [inputText, setInputText] = useState('');

  if (!video) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAddComment(video.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg h-[80vh] sm:h-[650px] max-h-[85vh] flex flex-col text-slate-100 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-base">Comments</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {formatNumber(video.commentsCount)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {(!video.comments || video.comments.length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <p className="text-sm font-medium mb-1">No comments yet</p>
              <p className="text-xs text-slate-600">Be the first to share your thoughts!</p>
            </div>
          ) : (
            video.comments.map((comment: Comment) => (
              <div key={comment.id} className="flex items-start space-x-3 group">
                <img
                  src={comment.authorAvatar}
                  alt={comment.authorName}
                  className="w-8 h-8 rounded-full object-cover border border-slate-800 flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0 bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className="text-xs font-bold text-slate-200 truncate">{comment.authorName}</span>
                      {comment.authorName === currentUser.name && currentUser.followersCount >= 10000 && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                      )}
                      <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed break-words">{comment.text}</p>
                  
                  {/* Comment Footer / Like */}
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <button
                      onClick={() => onLikeComment && onLikeComment(video.id, comment.id)}
                      className="flex items-center space-x-1 hover:text-rose-400 transition-colors"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          comment.isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-500'
                        }`}
                      />
                      <span>{comment.likesCount}</span>
                    </button>
                    <button className="hover:text-slate-200 transition-colors font-medium">Reply</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Comment Input Form */}
        <form onSubmit={handleSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-800 flex-shrink-0"
          />
          <input
            type="text"
            placeholder="Add a comment..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-xs text-slate-100 placeholder-slate-500 flex-1 focus:outline-none focus:border-purple-500/50"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
