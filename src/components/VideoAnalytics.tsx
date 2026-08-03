import React, { useState, useMemo } from 'react';
import { VideoItem } from '../types';
import {
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Play,
  Film,
  Sparkles,
  BarChart3,
  Calendar,
  Filter,
  Award,
  Zap,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { formatNumber } from '../utils/helpers';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface VideoAnalyticsProps {
  userVideos: VideoItem[];
  onOpenVideo?: (video: VideoItem) => void;
}

type TimeFrame = '7d' | '30d' | '90d' | 'all';
type ContentFilter = 'all' | 'reel' | 'video';

export const VideoAnalytics: React.FC<VideoAnalyticsProps> = ({ userVideos, onOpenVideo }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('30d');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // Filtered videos based on content type
  const filteredVideos = useMemo(() => {
    return userVideos.filter((v) => {
      if (contentFilter === 'reel') return v.type === 'reel';
      if (contentFilter === 'video') return v.type === 'video';
      return true;
    });
  }, [userVideos, contentFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalViews = filteredVideos.reduce((acc, v) => acc + v.viewsCount, 0);
    const totalLikes = filteredVideos.reduce((acc, v) => acc + v.likesCount, 0);
    const totalComments = filteredVideos.reduce((acc, v) => acc + v.commentsCount, 0);
    const totalShares = filteredVideos.reduce((acc, v) => acc + v.sharesCount, 0);
    const totalEngagement = totalLikes + totalComments + totalShares;
    const avgEngagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;

    const sortedByViews = [...filteredVideos].sort((a, b) => b.viewsCount - a.viewsCount);
    const topVideo = sortedByViews[0] || null;

    return {
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      totalEngagement,
      avgEngagementRate,
      topVideo,
      totalCount: filteredVideos.length,
    };
  }, [filteredVideos]);

  // Time Series Data Generation for Views & Engagement Trend
  const timeSeriesData = useMemo(() => {
    const days = timeFrame === '7d' ? 7 : timeFrame === '30d' ? 30 : timeFrame === '90d' ? 90 : 60;
    const data = [];
    const now = new Date();

    const baseViews = metrics.totalViews > 0 ? metrics.totalViews / days : 1200;
    const baseLikes = metrics.totalLikes > 0 ? metrics.totalLikes / days : 150;
    const baseComments = metrics.totalComments > 0 ? metrics.totalComments / days : 20;
    const baseShares = metrics.totalShares > 0 ? metrics.totalShares / days : 15;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Add controlled variance & spikes for video upload days
      const isSpikeDay = i % 6 === 0;
      const multiplier = isSpikeDay ? 1.8 + (i % 3) * 0.3 : 0.7 + ((i * 13) % 10) * 0.08;

      const dayViews = Math.round(baseViews * multiplier);
      const dayLikes = Math.round(baseLikes * multiplier);
      const dayComments = Math.round(baseComments * multiplier);
      const dayShares = Math.round(baseShares * multiplier);
      const dayEngagement = dayLikes + dayComments + dayShares;

      data.push({
        date: dateStr,
        views: dayViews,
        likes: dayLikes,
        comments: dayComments,
        shares: dayShares,
        engagement: dayEngagement,
      });
    }

    return data;
  }, [timeFrame, metrics]);

  // Per Video Chart Data
  const perVideoChartData = useMemo(() => {
    return filteredVideos.map((v) => ({
      id: v.id,
      shortTitle: v.title.length > 20 ? v.title.substring(0, 18) + '...' : v.title,
      fullTitle: v.title,
      views: v.viewsCount,
      likes: v.likesCount,
      comments: v.commentsCount,
      shares: v.sharesCount,
      type: v.type,
      engagementRate: v.viewsCount > 0 ? (((v.likesCount + v.commentsCount + v.sharesCount) / v.viewsCount) * 100).toFixed(1) : '0',
    }));
  }, [filteredVideos]);

  // Engagement Breakdown Pie Chart Data
  const pieData = useMemo(() => {
    return [
      { name: 'Likes', value: metrics.totalLikes, color: '#f43f5e' }, // Rose-500
      { name: 'Comments', value: metrics.totalComments, color: '#a855f7' }, // Purple-500
      { name: 'Shares', value: metrics.totalShares, color: '#38bdf8' }, // Sky-400
    ];
  }, [metrics]);

  // Reels vs Long Videos Comparison
  const formatComparison = useMemo(() => {
    const reels = userVideos.filter((v) => v.type === 'reel');
    const videos = userVideos.filter((v) => v.type === 'video');

    const reelsViews = reels.reduce((acc, v) => acc + v.viewsCount, 0);
    const videosViews = videos.reduce((acc, v) => acc + v.viewsCount, 0);

    const reelsAvgViews = reels.length > 0 ? Math.round(reelsViews / reels.length) : 0;
    const videosAvgViews = videos.length > 0 ? Math.round(videosViews / videos.length) : 0;

    const reelsEng = reels.reduce((acc, v) => acc + (v.likesCount + v.commentsCount + v.sharesCount), 0);
    const videosEng = videos.reduce((acc, v) => acc + (v.likesCount + v.commentsCount + v.sharesCount), 0);

    const reelsAvgRate = reelsViews > 0 ? ((reelsEng / reelsViews) * 100).toFixed(1) : '0';
    const videosAvgRate = videosViews > 0 ? ((videosEng / videosViews) * 100).toFixed(1) : '0';

    return [
      {
        format: 'Reels (9:16)',
        count: reels.length,
        avgViews: reelsAvgViews,
        totalViews: reelsViews,
        engagementRate: parseFloat(reelsAvgRate),
      },
      {
        format: 'Long Videos (16:9)',
        count: videos.length,
        avgViews: videosAvgViews,
        totalViews: videosViews,
        engagementRate: parseFloat(videosAvgRate),
      },
    ];
  }, [userVideos]);

  // Selected single video details
  const activeSelectedVideo = useMemo(() => {
    if (!selectedVideoId) return null;
    return userVideos.find((v) => v.id === selectedVideoId) || null;
  }, [selectedVideoId, userVideos]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Controls & Filter Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Video Analytics & Performance</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time view counts, engagement trends, and audience interaction for your video library.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Content Type Filter */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setContentFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                contentFilter === 'all'
                  ? 'bg-slate-800 text-white font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Content ({userVideos.length})
            </button>
            <button
              onClick={() => setContentFilter('reel')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                contentFilter === 'reel'
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Reels</span>
            </button>
            <button
              onClick={() => setContentFilter('video')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center space-x-1 ${
                contentFilter === 'video'
                  ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Long Videos</span>
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['7d', '30d', '90d', 'all'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFrame(tf)}
                className={`px-2.5 py-1.5 rounded-lg uppercase font-mono transition-colors ${
                  timeFrame === tf
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Views Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl relative overflow-hidden shadow-lg group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {formatNumber(metrics.totalViews)}
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-emerald-400 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% vs previous period</span>
          </div>
        </div>

        {/* Total Engagement Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl relative overflow-hidden shadow-lg group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Engagement</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {formatNumber(metrics.totalEngagement)}
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2 font-mono">
            <span className="text-rose-400">{formatNumber(metrics.totalLikes)} likes</span>
            <span>•</span>
            <span className="text-purple-400">{formatNumber(metrics.totalComments)} comments</span>
          </div>
        </div>

        {/* Engagement Rate Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl relative overflow-hidden shadow-lg group hover:border-slate-700 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg. Engagement Rate</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">
            {metrics.avgEngagementRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {metrics.avgEngagementRate > 8 ? '🔥 Exceptional audience retention' : '👍 Healthy audience interactions'}
          </div>
        </div>

        {/* Top Performing Video Card */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl relative overflow-hidden shadow-lg group hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Top Video
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {metrics.topVideo ? `${formatNumber(metrics.topVideo.viewsCount)} views` : 'N/A'}
            </span>
          </div>
          {metrics.topVideo ? (
            <div
              onClick={() => onOpenVideo && onOpenVideo(metrics.topVideo!)}
              className="flex items-center space-x-3 cursor-pointer mt-1 group/top hover:opacity-90 transition-opacity"
            >
              <img
                src={metrics.topVideo.posterUrl}
                alt={metrics.topVideo.title}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-100 line-clamp-1 group-hover/top:text-purple-400 transition-colors">
                  {metrics.topVideo.title}
                </p>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-mono mt-0.5">
                  <span className="text-rose-400">{formatNumber(metrics.topVideo.likesCount)} ❤️</span>
                  <span>{formatNumber(metrics.topVideo.sharesCount)} ↗️</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-2">No videos published yet</p>
          )}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: View Counts & Engagement Trend (AreaChart) - Spans 2 Columns */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span>View Counts & Interaction Trend</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Daily view count trajectory and audience engagement over time ({timeFrame.toUpperCase()})
              </p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Views
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Engagement
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(v)} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-xl shadow-2xl text-xs space-y-1.5">
                          <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{label}</p>
                          <div className="flex items-center justify-between gap-4 text-sky-400 font-mono">
                            <span>Views:</span>
                            <span className="font-bold">{formatNumber(payload[0]?.value as number)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-rose-400 font-mono">
                            <span>Likes & Interactions:</span>
                            <span className="font-bold">{formatNumber(payload[1]?.value as number)}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewsGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="engagement"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#engagementGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Engagement Mix Donut Chart */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Engagement Distribution</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Breakdown of audience actions across your video library
            </p>
          </div>

          <div className="h-52 w-full relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs font-mono">
                          <span style={{ color: data.payload.color }} className="font-bold">
                            {data.name}: {formatNumber(data.value as number)}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Donut Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-slate-400 font-medium">Total Actions</span>
              <span className="text-lg font-extrabold text-white font-mono">
                {formatNumber(metrics.totalEngagement)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-3 text-center text-xs">
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/50">
              <span className="text-rose-400 font-bold block font-mono">{formatNumber(metrics.totalLikes)}</span>
              <span className="text-[10px] text-slate-400">Likes</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/50">
              <span className="text-purple-400 font-bold block font-mono">{formatNumber(metrics.totalComments)}</span>
              <span className="text-[10px] text-slate-400">Comments</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/50">
              <span className="text-sky-400 font-bold block font-mono">{formatNumber(metrics.totalShares)}</span>
              <span className="text-[10px] text-slate-400">Shares</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Visual Section: Library Views Comparison BarChart & Format Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 3: Per-Video Views Comparison BarChart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Video Views Comparison</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Comparing view counts and likes across individual videos in your library
              </p>
            </div>
          </div>

          <div className="h-60 w-full">
            {perVideoChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                No videos available for comparison
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={perVideoChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="shortTitle"
                    stroke="#64748b"
                    fontSize={10}
                    tickLine={false}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatNumber(v)} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl text-xs space-y-1 max-w-xs">
                            <p className="font-bold text-white line-clamp-1">{item.fullTitle}</p>
                            <p className="text-[10px] text-purple-400 font-mono capitalize">Format: {item.type}</p>
                            <div className="text-sky-400 font-mono font-bold mt-1">
                              Views: {formatNumber(item.views)}
                            </div>
                            <div className="text-rose-400 font-mono">
                              Likes: {formatNumber(item.likes)} ({item.engagementRate}% rate)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="views" fill="#38bdf8" radius={[6, 6, 0, 0]} maxBarSize={45}>
                    {perVideoChartData.map((entry, index) => (
                      <Cell key={`cell-bar-${index}`} fill={entry.type === 'reel' ? '#f43f5e' : '#38bdf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/60 pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500" /> Reel (9:16)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-400" /> Long Video (16:9)
            </span>
          </div>
        </div>

        {/* Format Comparison Summary Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Format Efficiency</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Average performance comparison between Reels and Long Videos
            </p>
          </div>

          <div className="space-y-4 my-3">
            {formatComparison.map((fmt) => (
              <div key={fmt.format} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{fmt.format}</span>
                  <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                    {fmt.count} published
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Avg. Views / Post</span>
                    <span className="font-extrabold text-sky-400 text-sm">{formatNumber(fmt.avgViews)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Engagement Rate</span>
                    <span className="font-extrabold text-purple-400 text-sm">{fmt.engagementRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-950/30 border border-purple-800/40 p-3 rounded-xl text-[11px] text-purple-200 flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Creator Pro Tip:</strong> Short 9:16 Reels tend to drive 3x higher initial engagement rate, while 16:9 Long Videos accumulate watch time faster for monetization goals!
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Per-Video Analytics List / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Film className="w-4 h-4 text-rose-400" />
              <span>Video Library Performance Table</span>
            </h3>
            <p className="text-xs text-slate-400">
              Individual view stats, interaction counts, and virality scores for each video
            </p>
          </div>

          <span className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
            Showing {filteredVideos.length} items
          </span>
        </div>

        {filteredVideos.length === 0 ? (
          <p className="py-10 text-center text-slate-500 text-xs">
            No videos match the selected content filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                  <th className="pb-3 font-semibold">Video Details</th>
                  <th className="pb-3 font-semibold text-right">Views</th>
                  <th className="pb-3 font-semibold text-right">Likes</th>
                  <th className="pb-3 font-semibold text-right">Comments</th>
                  <th className="pb-3 font-semibold text-right">Shares</th>
                  <th className="pb-3 font-semibold text-right">Engagement %</th>
                  <th className="pb-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVideos.map((video) => {
                  const engRate = video.viewsCount > 0
                    ? (((video.likesCount + video.commentsCount + video.sharesCount) / video.viewsCount) * 100).toFixed(1)
                    : '0';

                  const isHighPerformer = parseFloat(engRate) > 6 || video.viewsCount > 50000;

                  return (
                    <tr
                      key={video.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => onOpenVideo && onOpenVideo(video)}
                    >
                      {/* Thumbnail & Title */}
                      <td className="py-3 pr-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-slate-800">
                            <img src={video.posterUrl} alt={video.title} className="w-full h-full object-cover" />
                            <span
                              className={`absolute bottom-0.5 right-0.5 text-[8px] font-mono px-1 rounded font-bold uppercase text-white ${
                                video.type === 'reel' ? 'bg-rose-600' : 'bg-sky-600'
                              }`}
                            >
                              {video.type}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <p className="font-bold text-slate-100 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                {video.title}
                              </p>
                              {isHighPerformer && (
                                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-mono px-1.5 py-0.2 rounded-full shrink-0">
                                  🔥 Viral
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {video.createdAt} • {video.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Views */}
                      <td className="py-3 px-2 text-right font-mono font-extrabold text-sky-400 text-sm">
                        {formatNumber(video.viewsCount)}
                      </td>

                      {/* Likes */}
                      <td className="py-3 px-2 text-right font-mono text-rose-400">
                        {formatNumber(video.likesCount)}
                      </td>

                      {/* Comments */}
                      <td className="py-3 px-2 text-right font-mono text-purple-400">
                        {formatNumber(video.commentsCount)}
                      </td>

                      {/* Shares */}
                      <td className="py-3 px-2 text-right font-mono text-amber-400">
                        {formatNumber(video.sharesCount)}
                      </td>

                      {/* Engagement % */}
                      <td className="py-3 px-2 text-right font-mono font-bold text-emerald-400">
                        {engRate}%
                      </td>

                      {/* Action */}
                      <td className="py-3 pl-2 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onOpenVideo) onOpenVideo(video);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                          title="Watch video"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
