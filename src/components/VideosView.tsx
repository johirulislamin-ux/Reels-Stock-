import React, { useState } from 'react';
import { VideoItem, Creator } from '../types';
import { Search, Play, Heart, MessageCircle, Share2, CheckCircle2, Clock, Eye, UserPlus, UserCheck, Film } from 'lucide-react';
import { formatNumber, formatDuration } from '../utils/helpers';

interface VideosViewProps {
  videos: VideoItem[];
  currentUser: Creator;
  onLikeVideo: (id: string) => void;
  onOpenComments: (video: VideoItem) => void;
  onOpenShare: (video: VideoItem) => void;
  onToggleFollowCreator: (creatorId: string) => void;
}

export const VideosView: React.FC<VideosViewProps> = ({
  videos,
  currentUser,
  onLikeVideo,
  onOpenComments,
  onOpenShare,
  onToggleFollowCreator,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const categories = ['All', 'Coding', 'Tech', 'Business', 'Travel', 'Fitness', 'Food'];

  const filteredVideos = videos.filter((vid) => {
    const matchesCategory = selectedCategory === 'All' || vid.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.creator.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 p-4 sm:p-6">
      {/* Top Search & Filter Bar */}
      <div className="max-w-6xl mx-auto mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Film className="w-6 h-6 text-sky-400" />
              <span>Watch Videos</span>
            </h1>
            <p className="text-xs text-slate-400">Discover long-form tutorials, vlogs & creator series</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search videos, topics, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500">
            <p className="text-sm font-medium">No videos found matching your search</p>
            <p className="text-xs text-slate-600 mt-1">Try another category or search term</p>
          </div>
        ) : (
          filteredVideos.map((video) => {
            const isVerified = video.creator.id === currentUser.id
              ? currentUser.followersCount >= 10000
              : (video.creator.followersCount >= 10000 || video.creator.isVerified);

            return (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-200 cursor-pointer group flex flex-col shadow-lg"
              >
                {/* Video Poster with Duration & Play Button */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  <img
                    src={video.posterUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center opacity-90 group-hover:scale-110 transition-transform border border-white/20 shadow-xl">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono font-semibold text-slate-200 border border-white/10">
                    {formatDuration(video.durationSeconds)}
                  </div>
                </div>

                {/* Video Info Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug mb-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {video.description}
                    </p>
                  </div>

                  {/* Creator Avatar & Stats Footer */}
                  <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0">
                      <img
                        src={video.creator.avatar}
                        alt={video.creator.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-700 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1 truncate">
                          <span className="text-xs font-semibold text-slate-300 truncate">{video.creator.name}</span>
                          {isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {formatNumber(video.viewsCount)} views • {video.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Expanded Video Detail Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100 shadow-2xl relative">
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white hover:bg-black transition-colors"
            >
              ✕
            </button>

            {/* Video Player Box */}
            <div className="w-full aspect-video bg-black relative">
              <video
                src={activeVideo.videoUrl}
                poster={activeVideo.posterUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            {/* Video Details & Interaction Controls */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-slate-100">{activeVideo.title}</h2>
                  <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-sky-400" /> {formatNumber(activeVideo.viewsCount)} views</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-400" /> {formatDuration(activeVideo.durationSeconds)}</span>
                    <span>•</span>
                    <span>{activeVideo.createdAt}</span>
                  </div>
                </div>

                {/* Interaction Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onLikeVideo(activeVideo.id)}
                    className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      activeVideo.isLiked
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${activeVideo.isLiked ? 'fill-rose-500' : ''}`} />
                    <span>{formatNumber(activeVideo.likesCount)}</span>
                  </button>

                  <button
                    onClick={() => onOpenComments(activeVideo)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{formatNumber(activeVideo.commentsCount)}</span>
                  </button>

                  <button
                    onClick={() => onOpenShare(activeVideo)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Creator Info & Follow */}
              <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeVideo.creator.avatar}
                    alt={activeVideo.creator.name}
                    className="w-11 h-11 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-sm text-slate-200">{activeVideo.creator.name}</span>
                      {(activeVideo.creator.id === currentUser.id
                        ? currentUser.followersCount >= 10000
                        : activeVideo.creator.followersCount >= 10000 || activeVideo.creator.isVerified) && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {formatNumber(activeVideo.creator.followersCount)} followers
                    </span>
                  </div>
                </div>

                {activeVideo.creator.id !== currentUser.id && (
                  <button
                    onClick={() => onToggleFollowCreator(activeVideo.creator.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      activeVideo.creator.isFollowing
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-sky-500 hover:bg-sky-400 text-white'
                    }`}
                  >
                    {activeVideo.creator.isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Description & Hashtags */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeVideo.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {activeVideo.hashtags.map((tag) => (
                    <span key={tag} className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
