import React, { useState, useRef, useEffect } from 'react';
import { VideoItem, Creator } from '../types';
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, Play, Pause, Music, CheckCircle2, UserPlus, UserCheck, Sparkles } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface ReelsViewProps {
  reels: VideoItem[];
  currentUser: Creator;
  onLikeReel: (id: string) => void;
  onBookmarkReel: (id: string) => void;
  onOpenComments: (reel: VideoItem) => void;
  onOpenShare: (reel: VideoItem) => void;
  onToggleFollowCreator: (creatorId: string) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  currentUser,
  onLikeReel,
  onBookmarkReel,
  onOpenComments,
  onOpenShare,
  onToggleFollowCreator,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentReel = reels[currentIndex] || reels[0];

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {
          // Auto-play policy fallback
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleDoubleTap = () => {
    if (currentReel && !currentReel.isLiked) {
      onLikeReel(currentReel.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 900);
  };

  if (!currentReel) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        No reels available
      </div>
    );
  }

  const creatorIsVerified = currentReel.creator.id === currentUser.id
    ? currentUser.followersCount >= 10000
    : (currentReel.creator.followersCount >= 10000 || currentReel.creator.isVerified);

  return (
    <div className="relative w-full h-full bg-black select-none flex flex-col justify-between overflow-hidden">
      {/* Top Navigation Overlay */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between pointer-events-auto">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-extrabold tracking-wide text-white uppercase flex items-center gap-1">
            Reels <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-slate-200 border border-white/10 font-mono">
            {currentIndex + 1} / {reels.length}
          </span>
        </div>

        {/* Mute & Next/Prev Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white hover:bg-black/60 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Video Screen Area */}
      <div
        className="relative flex-1 w-full h-full flex items-center justify-center bg-slate-950 cursor-pointer"
        onClick={() => setIsPlaying(!isPlaying)}
        onDoubleClick={handleDoubleTap}
      >
        <video
          ref={videoRef}
          src={currentReel.videoUrl}
          poster={currentReel.posterUrl}
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Double-tap Heart Animation */}
        {showHeartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-ping duration-500">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 shadow-2xl filter drop-shadow-lg" />
          </div>
        )}

        {/* Play/Pause Overlay Indicator when paused */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Play className="w-8 h-8 fill-white ml-1" />
            </div>
          </div>
        )}

        {/* Up / Down Nav Arrow Overlays */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 flex flex-col space-y-3 pointer-events-auto">
          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/70 border border-white/10 transition-all"
              title="Previous Reel (Up)"
            >
              ▲
            </button>
          )}
          {currentIndex < reels.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="p-2 rounded-full bg-black/40 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/70 border border-white/10 transition-all"
              title="Next Reel (Down)"
            >
              ▼
            </button>
          )}
        </div>

        {/* Right Interaction Sidebar Buttons */}
        <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center space-y-5 pointer-events-auto">
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikeReel(currentReel.id);
            }}
            className="flex flex-col items-center group"
          >
            <div
              className={`p-3 rounded-full backdrop-blur-md transition-all group-hover:scale-110 ${
                currentReel.isLiked
                  ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
                  : 'bg-black/40 text-white border border-white/10 hover:bg-black/60'
              }`}
            >
              <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'fill-rose-500' : ''}`} />
            </div>
            <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-md">
              {formatNumber(currentReel.likesCount)}
            </span>
          </button>

          {/* Comments Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments(currentReel);
            }}
            className="flex flex-col items-center group"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-all group-hover:scale-110">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-md">
              {formatNumber(currentReel.commentsCount)}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenShare(currentReel);
            }}
            className="flex flex-col items-center group"
          >
            <div className="p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-all group-hover:scale-110">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-md">
              {formatNumber(currentReel.sharesCount)}
            </span>
          </button>

          {/* Bookmark / Save */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmarkReel(currentReel.id);
            }}
            className="flex flex-col items-center group"
          >
            <div
              className={`p-3 rounded-full backdrop-blur-md transition-all group-hover:scale-110 ${
                currentReel.isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-black/40 text-white border border-white/10 hover:bg-black/60'
              }`}
            >
              <Bookmark className={`w-6 h-6 ${currentReel.isBookmarked ? 'fill-amber-400' : ''}`} />
            </div>
            <span className="text-[11px] font-semibold text-white mt-1 drop-shadow-md">Save</span>
          </button>

          {/* Rotating Audio Vinyl Disk */}
          <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-700 p-1 animate-spin duration-[4000ms] shadow-lg flex items-center justify-center">
            <Music className="w-4 h-4 text-purple-400" />
          </div>
        </div>

        {/* Bottom Information Overlay */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 pt-12 bg-gradient-to-t from-black via-black/70 to-transparent text-white pointer-events-auto">
          {/* Creator Info Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2.5">
              <img
                src={currentReel.creator.avatar}
                alt={currentReel.creator.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/80 shadow-md"
              />
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-sm text-white drop-shadow-sm">
                    {currentReel.creator.name}
                  </span>
                  {/* Blue Tick Badge */}
                  {creatorIsVerified && (
                    <span className="inline-flex items-center text-sky-400" title="Verified Creator (10,000+ Followers)">
                      <CheckCircle2 className="w-4 h-4 fill-sky-400/20" />
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-300 font-mono">{currentReel.creator.handle}</span>
              </div>
            </div>

            {/* Follow / Unfollow Button */}
            {currentReel.creator.id !== currentUser.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollowCreator(currentReel.creator.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1 shadow-lg ${
                  currentReel.creator.isFollowing
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/20'
                    : 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white'
                }`}
              >
                {currentReel.creator.isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Reel Caption & Description */}
          <h2 className="text-sm font-medium text-slate-100 mb-1.5 line-clamp-2 leading-snug drop-shadow-sm">
            {currentReel.title}
          </h2>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {currentReel.hashtags.map((tag) => (
              <span key={tag} className="text-xs font-semibold text-sky-300 hover:underline">
                #{tag}
              </span>
            ))}
          </div>

          {/* Audio Track Tag */}
          <div className="flex items-center space-x-2 text-xs text-slate-300 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit max-w-[240px] border border-white/10">
            <Music className="w-3.5 h-3.5 text-rose-400 animate-pulse flex-shrink-0" />
            <span className="truncate text-[11px] font-mono">
              {currentReel.audioTrackName || `${currentReel.creator.name} • Original Audio`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
