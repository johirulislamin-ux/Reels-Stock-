import React, { useState, useEffect } from 'react';
import { Creator } from '../types';
import { CheckCircle2, DollarSign, Users, Clock, Award, Sparkles, TrendingUp, ShieldCheck, Zap, ArrowUpRight, Lock, Unlock } from 'lucide-react';
import { formatNumber, formatWatchHours, triggerConfettiCelebration } from '../utils/helpers';
import { getMonetizationAdvice } from '../services/geminiService';

interface MonetizationDashboardProps {
  user: Creator;
  onSimulateFollowers: (count: number) => void;
  onSimulateWatchHours: (hours: number) => void;
  onUnlockInstantMonetization: () => void;
}

export const MonetizationDashboard: React.FC<MonetizationDashboardProps> = ({
  user,
  onSimulateFollowers,
  onSimulateWatchHours,
  onUnlockInstantMonetization,
}) => {
  const [aiAdvice, setAiAdvice] = useState<string>('Loading AI monetization strategist recommendations...');
  const [loadingAi, setLoadingAi] = useState(false);

  const REQUIRED_FOLLOWERS = 10000;
  const REQUIRED_WATCH_HOURS = 3000;

  const followersProgress = Math.min(100, Math.round((user.followersCount / REQUIRED_FOLLOWERS) * 100));
  const watchHoursProgress = Math.min(100, Math.round((user.totalWatchHours / REQUIRED_WATCH_HOURS) * 100));

  const isFollowersMet = user.followersCount >= REQUIRED_FOLLOWERS;
  const isWatchHoursMet = user.totalWatchHours >= REQUIRED_WATCH_HOURS;
  const isFullyMonetized = isFollowersMet && isWatchHoursMet;

  useEffect(() => {
    fetchAdvice();
  }, [user.followersCount, user.totalWatchHours]);

  const fetchAdvice = async () => {
    setLoadingAi(true);
    const advice = await getMonetizationAdvice(user.followersCount, user.totalWatchHours);
    setAiAdvice(advice);
    setLoadingAi(false);
  };

  const handleInstantUnlock = () => {
    onUnlockInstantMonetization();
    triggerConfettiCelebration();
  };

  return (
    <div className="w-full min-h-full bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Banner Header */}
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> ReelVerse Partner Program
              </span>
              {isFollowersMet && (
                <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" /> Blue Tick Received
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Creator Monetization & Verification Studio
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Earn ad revenue, receive brand sponsorships, unlock fan memberships, and display the official{' '}
              <strong className="text-sky-400">Blue Tick Verification Badge</strong> on your profile!
            </p>
          </div>

          {/* Verification Status Badge */}
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center w-full md:w-auto min-w-[220px]">
            <div className="relative w-16 h-16 mx-auto mb-2 flex items-center justify-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-700"
              />
              {isFollowersMet && (
                <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5">
                  <CheckCircle2 className="w-6 h-6 text-sky-400 fill-sky-400/20" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-center space-x-1">
              <span className="font-bold text-sm text-slate-100">{user.name}</span>
              {isFollowersMet && <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400/20" />}
            </div>
            <p className="text-xs text-slate-400 font-mono">{user.handle}</p>
            <div className="mt-3">
              {isFullyMonetized ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center justify-center gap-1">
                  <Unlock className="w-3.5 h-3.5" /> Monetization Active
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> Status: In Progress
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Criteria Cards Grid */}
      <div className="max-w-6xl mx-auto space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>Eligibility Requirements (10,000 Followers & 3,000 Watch Hours)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Requirement 1: 10,000 Followers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 relative overflow-hidden shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-2xl ${isFollowersMet ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100">10,000 Followers</h3>
                  <p className="text-xs text-slate-400">Unlocks official Blue Tick Badge & Fans Network</p>
                </div>
              </div>
              {isFollowersMet ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Met
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                  {followersProgress}%
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">{formatNumber(user.followersCount)} followers</span>
                <span className="text-slate-400">Goal: 10,000</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
                  style={{ width: `${followersProgress}%` }}
                />
              </div>
            </div>

            {/* Blue Tick Badge Notification */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-sky-400 fill-sky-400/20 flex-shrink-0" />
              <span>
                {isFollowersMet ? (
                  <strong className="text-sky-400">Blue Tick Verified! Your profile features the verified badge.</strong>
                ) : (
                  `Reach ${REQUIRED_FOLLOWERS - user.followersCount} more followers to receive the Blue Tick badge.`
                )}
              </span>
            </div>
          </div>

          {/* Requirement 2: 3,000 Hours Watch Time */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 relative overflow-hidden shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-2xl ${isWatchHoursMet ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-100">3,000 Watch Hours</h3>
                  <p className="text-xs text-slate-400">Unlocks Ad Revenue Share ($2.40 RPM) & Creator Fund</p>
                </div>
              </div>
              {isWatchHoursMet ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Met
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                  {watchHoursProgress}%
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">{formatWatchHours(user.totalWatchHours)}</span>
                <span className="text-slate-400">Goal: 3,000 hrs</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${watchHoursProgress}%` }}
                />
              </div>
            </div>

            {/* Watch Time Note */}
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>
                {isWatchHoursMet ? (
                  <strong className="text-amber-400">Watch time goal complete! Eligible for daily payouts.</strong>
                ) : (
                  `Accumulate ${Math.max(0, REQUIRED_WATCH_HOURS - user.totalWatchHours).toFixed(1)} more watch hours across Reels & Videos.`
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Growth Simulator Controls */}
      <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Creator Growth Simulator</span>
            </h3>
            <p className="text-xs text-slate-400">Test and preview monetization eligibility & blue tick unlock live</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onSimulateFollowers(500)}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-slate-200 text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all"
          >
            <span className="text-sky-400 font-bold text-sm">+500 Followers</span>
            <span className="text-[10px] text-slate-500">Simulate fan viral surge</span>
          </button>

          <button
            onClick={() => onSimulateFollowers(1000)}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 text-slate-200 text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all"
          >
            <span className="text-sky-400 font-bold text-sm">+1,000 Followers</span>
            <span className="text-[10px] text-slate-500">Reel went trending!</span>
          </button>

          <button
            onClick={() => onSimulateWatchHours(250)}
            className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-200 text-xs font-semibold flex flex-col items-center justify-center space-y-1 transition-all"
          >
            <span className="text-amber-400 font-bold text-sm">+250 Watch Hours</span>
            <span className="text-[10px] text-slate-500">Long video binge</span>
          </button>

          <button
            onClick={handleInstantUnlock}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white text-xs font-bold flex flex-col items-center justify-center space-y-1 shadow-lg shadow-purple-500/20 transition-all col-span-2 sm:col-span-1"
          >
            <span className="flex items-center gap-1 font-extrabold text-sm">
              <Sparkles className="w-4 h-4" /> INSTANT UNLOCK
            </span>
            <span className="text-[10px] text-white/80">10k Followers + 3k Hours</span>
          </button>
        </div>
      </div>

      {/* AI Monetization Advice */}
      <div className="max-w-6xl mx-auto bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" /> Gemini AI Creator Coach
          </span>
          <button
            onClick={fetchAdvice}
            disabled={loadingAi}
            className="text-xs text-indigo-400 hover:text-indigo-200 underline font-mono"
          >
            Refresh Strategy
          </button>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line font-mono bg-slate-950/80 p-4 rounded-2xl border border-indigo-500/20">
          {aiAdvice}
        </p>
      </div>

      {/* Monetized Features Breakdown */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="p-3 w-fit rounded-xl bg-emerald-500/20 text-emerald-400 mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-100">Ad Revenue Share</h4>
          <p className="text-xs text-slate-400">Earn up to $2.40 per 1,000 views on long videos and reels automatically once monetized.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="p-3 w-fit rounded-xl bg-sky-500/20 text-sky-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-100">Blue Tick Badge</h4>
          <p className="text-xs text-slate-400">Official verification tick badge displayed on all your video overlays, comments, and profile.</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="p-3 w-fit rounded-xl bg-purple-500/20 text-purple-400 mb-2">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-slate-100">Brand Sponsorships</h4>
          <p className="text-xs text-slate-400">Direct creator marketplace matching you with top brands for sponsored video integrations.</p>
        </div>
      </div>
    </div>
  );
};
