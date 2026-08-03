import React, { useState } from 'react';
import { DeviceMode, VideoItem, Creator } from './types';
import { CURRENT_USER, MOCK_CREATORS, INITIAL_REELS, INITIAL_LONG_VIDEOS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { DeviceFrame } from './components/DeviceFrame';
import { ReelsView } from './components/ReelsView';
import { VideosView } from './components/VideosView';
import { CreateStudioModal } from './components/CreateStudioModal';
import { MonetizationDashboard } from './components/MonetizationDashboard';
import { ProfileView } from './components/ProfileView';
import { ShareModal } from './components/ShareModal';
import { CommentsModal } from './components/CommentsModal';
import { triggerConfettiCelebration } from './utils/helpers';

export default function App() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('iphone');
  const [activeTab, setActiveTab] = useState<'reels' | 'videos' | 'create' | 'monetization' | 'profile'>('reels');

  // Core User & Creators State
  const [currentUser, setCurrentUser] = useState<Creator>(CURRENT_USER);
  const [allCreators, setAllCreators] = useState<Creator[]>(MOCK_CREATORS);

  // Video Feeds State
  const [reels, setReels] = useState<VideoItem[]>(INITIAL_REELS);
  const [longVideos, setLongVideos] = useState<VideoItem[]>(INITIAL_LONG_VIDEOS);

  // Modals
  const [shareModalVideo, setShareModalVideo] = useState<VideoItem | null>(null);
  const [commentsModalVideo, setCommentsModalVideo] = useState<VideoItem | null>(null);

  // Helper to update followers and watch hours, checking for the 10,000 blue tick milestone!
  const updateCurrentUserStats = (followersDelta: number, watchHoursDelta: number) => {
    setCurrentUser((prev) => {
      const newFollowers = Math.max(0, prev.followersCount + followersDelta);
      const newWatchHours = Math.max(0, prev.totalWatchHours + watchHoursDelta);
      const wasVerified = prev.followersCount >= 10000;
      const isNowVerified = newFollowers >= 10000;

      if (!wasVerified && isNowVerified) {
        triggerConfettiCelebration();
      }

      return {
        ...prev,
        followersCount: newFollowers,
        totalWatchHours: newWatchHours,
        isVerified: isNowVerified,
        isMonetized: isNowVerified && newWatchHours >= 3000,
      };
    });
  };

  const handleUnlockInstantMonetization = () => {
    setCurrentUser((prev) => ({
      ...prev,
      followersCount: 10450,
      totalWatchHours: 3200,
      isVerified: true,
      isMonetized: true,
    }));
  };

  // Video Interactions
  const handleLikeReel = (id: string) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isLiked = !r.isLiked;
          return {
            ...r,
            isLiked,
            likesCount: isLiked ? r.likesCount + 1 : r.likesCount - 1,
          };
        }
        return r;
      })
    );
  };

  const handleBookmarkReel = (id: string) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
  };

  const handleLikeVideo = (id: string) => {
    setLongVideos((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likesCount: isLiked ? v.likesCount + 1 : v.likesCount - 1,
          };
        }
        return v;
      })
    );
  };

  const handleToggleFollowCreator = (creatorId: string) => {
    setAllCreators((prev) =>
      prev.map((c) => {
        if (c.id === creatorId) {
          const isFollowing = !c.isFollowing;
          return {
            ...c,
            isFollowing,
            followersCount: isFollowing ? c.followersCount + 1 : c.followersCount - 1,
          };
        }
        return c;
      })
    );

    // Update inside feeds as well
    setReels((prev) =>
      prev.map((r) =>
        r.creator.id === creatorId
          ? { ...r, creator: { ...r.creator, isFollowing: !r.creator.isFollowing } }
          : r
      )
    );
    setLongVideos((prev) =>
      prev.map((v) =>
        v.creator.id === creatorId
          ? { ...v, creator: { ...v.creator, isFollowing: !v.creator.isFollowing } }
          : v
      )
    );
  };

  // Comment Addition
  const handleAddComment = (videoId: string, commentText: string) => {
    const newComment = {
      id: `comm_${Date.now()}`,
      authorName: currentUser.name,
      authorHandle: currentUser.handle,
      authorAvatar: currentUser.avatar,
      text: commentText,
      timestamp: 'Just now',
      likesCount: 0,
    };

    setReels((prev) =>
      prev.map((r) =>
        r.id === videoId
          ? {
              ...r,
              commentsCount: r.commentsCount + 1,
              comments: [newComment, ...(r.comments || [])],
            }
          : r
      )
    );

    setLongVideos((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? {
              ...v,
              commentsCount: v.commentsCount + 1,
              comments: [newComment, ...(v.comments || [])],
            }
          : v
      )
    );

    if (commentsModalVideo && commentsModalVideo.id === videoId) {
      setCommentsModalVideo((prev) =>
        prev
          ? {
              ...prev,
              commentsCount: prev.commentsCount + 1,
              comments: [newComment, ...(prev.comments || [])],
            }
          : null
      );
    }
  };

  const handleLikeComment = (videoId: string, commentId: string) => {
    const updateComments = (comments?: any[]) =>
      comments?.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likesCount: isLiked ? c.likesCount + 1 : c.likesCount - 1,
          };
        }
        return c;
      });

    setReels((prev) =>
      prev.map((r) => (r.id === videoId ? { ...r, comments: updateComments(r.comments) } : r))
    );
    setLongVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, comments: updateComments(v.comments) } : v))
    );

    if (commentsModalVideo && commentsModalVideo.id === videoId) {
      setCommentsModalVideo((prev) =>
        prev ? { ...prev, comments: updateComments(prev.comments) } : null
      );
    }
  };

  // Publish newly created Reel or Video
  const handlePublishVideo = (newVideo: VideoItem) => {
    if (newVideo.type === 'reel') {
      setReels([newVideo, ...reels]);
      setActiveTab('reels');
    } else {
      setLongVideos([newVideo, ...longVideos]);
      setActiveTab('videos');
    }
    // Reward creator with watch hours and new followers for publishing!
    updateCurrentUserStats(80, 15);
  };

  // Handle Tab Switch
  const handleTabChange = (tab: 'reels' | 'videos' | 'create' | 'monetization' | 'profile') => {
    setActiveTab(tab);
  };

  const allUserVideos = [
    ...reels.filter((r) => r.creator.id === currentUser.id),
    ...longVideos.filter((v) => v.creator.id === currentUser.id),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        user={currentUser}
      />

      {/* Main Content inside Multi-Device Chassis */}
      <main className="flex-1 w-full flex flex-col">
        <DeviceFrame deviceMode={deviceMode}>
          {activeTab === 'reels' && (
            <ReelsView
              reels={reels}
              currentUser={currentUser}
              onLikeReel={handleLikeReel}
              onBookmarkReel={handleBookmarkReel}
              onOpenComments={(reel) => setCommentsModalVideo(reel)}
              onOpenShare={(reel) => setShareModalVideo(reel)}
              onToggleFollowCreator={handleToggleFollowCreator}
            />
          )}

          {activeTab === 'videos' && (
            <VideosView
              videos={longVideos}
              currentUser={currentUser}
              onLikeVideo={handleLikeVideo}
              onOpenComments={(vid) => setCommentsModalVideo(vid)}
              onOpenShare={(vid) => setShareModalVideo(vid)}
              onToggleFollowCreator={handleToggleFollowCreator}
            />
          )}

          {activeTab === 'monetization' && (
            <MonetizationDashboard
              user={currentUser}
              onSimulateFollowers={(count) => updateCurrentUserStats(count, 0)}
              onSimulateWatchHours={(hours) => updateCurrentUserStats(0, hours)}
              onUnlockInstantMonetization={handleUnlockInstantMonetization}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              user={currentUser}
              userVideos={allUserVideos}
              allCreators={allCreators}
              onToggleFollowCreator={handleToggleFollowCreator}
              onOpenVideo={(vid) => {
                if (vid.type === 'reel') {
                  setActiveTab('reels');
                } else {
                  setActiveTab('videos');
                }
              }}
              onUpdateBio={(newBio) => setCurrentUser((prev) => ({ ...prev, bio: newBio }))}
            />
          )}
        </DeviceFrame>
      </main>

      {/* Global Modals */}
      {activeTab === 'create' && (
        <CreateStudioModal
          currentUser={currentUser}
          onPublishVideo={handlePublishVideo}
          onClose={() => setActiveTab('reels')}
        />
      )}

      {shareModalVideo && (
        <ShareModal
          video={shareModalVideo}
          onClose={() => setShareModalVideo(null)}
          onShareSuccess={(videoId) => {
            setReels((prev) =>
              prev.map((r) => (r.id === videoId ? { ...r, sharesCount: r.sharesCount + 1 } : r))
            );
            setLongVideos((prev) =>
              prev.map((v) => (v.id === videoId ? { ...v, sharesCount: v.sharesCount + 1 } : v))
            );
          }}
        />
      )}

      {commentsModalVideo && (
        <CommentsModal
          video={commentsModalVideo}
          currentUser={currentUser}
          onClose={() => setCommentsModalVideo(null)}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
        />
      )}
    </div>
  );
}
