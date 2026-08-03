export type DeviceMode = 'iphone' | 'android' | 'pc';

export type AspectRatio = '9:16' | '16:9';

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  totalWatchHours: number;
  isVerified: boolean; // Blue Tick
  isMonetized: boolean;
  isFollowing?: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface VideoItem {
  id: string;
  type: 'reel' | 'video'; // reel = 9:16 vertical, video = 16:9 horizontal
  title: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  creator: Creator;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  durationSeconds: number;
  category: string;
  hashtags: string[];
  audioTrackName?: string;
  createdAt: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  comments?: Comment[];
}

export interface MonetizationCriteria {
  requiredFollowers: number; // 10000
  requiredWatchHours: number; // 3000
  currentFollowers: number;
  currentWatchHours: number;
  isMonetized: boolean;
  isVerifiedBlueTick: boolean;
  estimatedEarnings: number;
}
