import React, { useState } from 'react';
import { Creator, VideoItem } from '../types';
import { CheckCircle2, Film, PlayCircle, Users, Clock, Edit3, Settings, UserPlus, UserCheck, X, BarChart3 } from 'lucide-react';
import { formatNumber, formatWatchHours } from '../utils/helpers';
import { VideoAnalytics } from './VideoAnalytics';

interface ProfileViewProps {
  user: Creator;
  userVideos: VideoItem[];
  allCreators: Creator[];
  onToggleFollowCreator: (creatorId: string) => void;
  onOpenVideo: (video: VideoItem) => void;
  onUpdateBio: (newBio: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  userVideos,
  allCreators,
  onToggleFollowCreator,
  onOpenVideo,
  onUpdateBio,
}) => {
  const [activeTab, setActiveTab] = useState<'reels' | 'videos' | 'analytics'>('reels');
  const [showFollowersModal, setShowFollowersModal] = useState<'followers' | 'following' | null>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(user.bio);

  const isBlueTick = user.followersCount >= 10000;

  const userReels = userVideos.filter((v) => v.type === 'reel');
  const userLongVideos = userVideos.filter((v) => v.type === 'video');

  const handleBioSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBio(bioInput);
    setIsEditingBio(false);
  };

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Profile Header Card */}
      <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Cover Graphic Banner */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-rose-600 via-purple-700 to-sky-600 relative p-4">
          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-white border border-white/10">
            {isBlueTick ? 'Verified Creator' : 'Creator Account'}
          </div>
        </div>

        {/* Profile Info Container */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-12 mb-4 gap-4">
            {/* Avatar with Blue Tick */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-slate-900 shadow-2xl"
              />
              {isBlueTick && (
                <div className="absolute bottom-1 right-1 bg-slate-900 rounded-full p-0.5" title="Blue Tick Verified">
                  <CheckCircle2 className="w-7 h-7 text-sky-400 fill-sky-400/20" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Bio</span>
              </button>
            </div>
          </div>

          {/* User Name & Bio */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{user.name}</h1>
              {isBlueTick && (
                <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/20" />
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">{user.handle}</p>

            {isEditingBio ? (
              <form onSubmit={handleBioSave} className="mt-2 space-y-2">
                <textarea
                  rows={2}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingBio(false)}
                    className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500"
                  >
                    Save Bio
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{user.bio}</p>
            )}
          </div>

          {/* Stats Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
            <button
              onClick={() => setShowFollowersModal('followers')}
              className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors text-center"
            >
              <span className="block text-lg font-extrabold text-white">{formatNumber(user.followersCount)}</span>
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3 h-3 text-sky-400" /> Followers
              </span>
            </button>

            <button
              onClick={() => setShowFollowersModal('following')}
              className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors text-center"
            >
              <span className="block text-lg font-extrabold text-white">{user.followingCount}</span>
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                <Users className="w-3 h-3 text-purple-400" /> Following
              </span>
            </button>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="block text-lg font-extrabold text-amber-400">{formatWatchHours(user.totalWatchHours)}</span>
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-amber-400" /> Watch Time
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="block text-lg font-extrabold text-emerald-400">{userVideos.length}</span>
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                <Film className="w-3 h-3 text-emerald-400" /> Uploads
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Content Tabs (Reels vs Long Videos) */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('reels')}
            className={`pb-3 px-6 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'reels'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Published Reels ({userReels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 px-6 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'videos'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Long Videos ({userLongVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 px-6 text-xs sm:text-sm font-bold flex items-center space-x-2 border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>Video Analytics</span>
          </button>
        </div>

        {/* Reels Grid (9:16 aspect) */}
        {activeTab === 'reels' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {userReels.length === 0 ? (
              <p className="col-span-full py-12 text-center text-slate-500 text-xs">No reels published yet</p>
            ) : (
              userReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => onOpenVideo(reel)}
                  className="aspect-[9/16] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative group cursor-pointer shadow-lg"
                >
                  <img src={reel.posterUrl} alt={reel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <p className="text-xs font-bold text-white line-clamp-1">{reel.title}</p>
                    <span className="text-[10px] text-slate-300 font-mono mt-0.5">{formatNumber(reel.viewsCount)} views</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Long Videos Grid (16:9 aspect) */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userLongVideos.length === 0 ? (
              <p className="col-span-full py-12 text-center text-slate-500 text-xs">No long videos published yet</p>
            ) : (
              userLongVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => onOpenVideo(video)}
                  className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 group cursor-pointer shadow-lg flex flex-col"
                >
                  <div className="aspect-video bg-black relative">
                    <img src={video.posterUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-xs text-slate-200 line-clamp-1">{video.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{formatNumber(video.viewsCount)} views • {video.createdAt}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Video Analytics Tab */}
        {activeTab === 'analytics' && (
          <VideoAnalytics userVideos={userVideos} onOpenVideo={onOpenVideo} />
        )}
      </div>

      {/* Followers / Following List Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 text-slate-100 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base capitalize">{showFollowersModal} Network</h3>
              <button
                onClick={() => setShowFollowersModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {allCreators.map((creator) => (
                <div key={creator.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <img src={creator.avatar} alt={creator.name} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-bold text-slate-200">{creator.name}</span>
                        {(creator.followersCount >= 10000 || creator.isVerified) && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{creator.handle}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFollowCreator(creator.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                      creator.isFollowing
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-sky-500 hover:bg-sky-400 text-white'
                    }`}
                  >
                    {creator.isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
