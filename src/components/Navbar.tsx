import React from 'react';
import { DeviceMode, Creator } from '../types';
import { Smartphone, Monitor, Film, PlayCircle, PlusCircle, DollarSign, User, CheckCircle2, Award } from 'lucide-react';

interface NavbarProps {
  activeTab: 'reels' | 'videos' | 'create' | 'monetization' | 'profile';
  setActiveTab: (tab: 'reels' | 'videos' | 'create' | 'monetization' | 'profile') => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  user: Creator;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  deviceMode,
  setDeviceMode,
  user,
}) => {
  const isBlueTick = user.followersCount >= 10000;

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Name */}
        <div
          onClick={() => setActiveTab('reels')}
          className="flex items-center space-x-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-sky-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-sky-200 to-purple-300 bg-clip-text text-transparent">
                ReelVerse
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">iPhone • Android • PC</p>
          </div>
        </div>

        {/* Tab Navigation (Center) */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('reels')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'reels'
                ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Film className="w-4 h-4" />
            <span className="hidden md:inline">Reels</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span className="hidden md:inline">Videos</span>
          </button>

          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </button>

          <button
            onClick={() => setActiveTab('monetization')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'monetization'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span className="hidden lg:inline">Monetization</span>
            {isBlueTick && (
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 fill-sky-400/20" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-slate-800 text-white ring-1 ring-slate-700'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-5 h-5 rounded-full object-cover border border-slate-700"
              />
              {isBlueTick && (
                <CheckCircle2 className="w-3 h-3 text-sky-400 fill-sky-400/20 absolute -bottom-1 -right-1" />
              )}
            </div>
            <span className="hidden md:inline">{user.name.split(' ')[0]}</span>
          </button>
        </nav>

        {/* Device Switcher Controls (Right) */}
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-shrink-0">
          <button
            onClick={() => setDeviceMode('iphone')}
            title="iPhone Mode"
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'iphone'
                ? 'bg-slate-800 text-sky-400 shadow ring-1 ring-sky-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden lg:inline">iPhone</span>
          </button>

          <button
            onClick={() => setDeviceMode('android')}
            title="Android Mode"
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'android'
                ? 'bg-slate-800 text-emerald-400 shadow ring-1 ring-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Android</span>
          </button>

          <button
            onClick={() => setDeviceMode('pc')}
            title="PC / Desktop Mode"
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              deviceMode === 'pc'
                ? 'bg-slate-800 text-purple-400 shadow ring-1 ring-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden lg:inline">PC Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
};
