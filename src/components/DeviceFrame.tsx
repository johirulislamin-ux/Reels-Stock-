import React from 'react';
import { DeviceMode } from '../types';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceFrameProps {
  deviceMode: DeviceMode;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ deviceMode, children }) => {
  if (deviceMode === 'pc') {
    return (
      <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col">
        {/* PC Browser Header Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400 select-none">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
            </div>
            <div className="h-4 w-px bg-slate-800 mx-2"></div>
            <div className="bg-slate-950/80 border border-slate-800/80 px-3 py-1 rounded-md flex items-center space-x-2 text-slate-300 w-64 md:w-96 text-xs font-mono truncate">
              <span className="text-emerald-400">https://</span>reelverse.app/studio
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-slate-400 font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-sky-400">PC / Desktop View</span>
            <span>1920 x 1080</span>
          </div>
        </div>
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-slate-950">
          {children}
        </div>
      </div>
    );
  }

  // Mobile Device Frame (iPhone or Android)
  const isIphone = deviceMode === 'iphone';

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div
        className={`relative w-full max-w-[410px] h-[820px] max-h-[90vh] bg-black rounded-[48px] shadow-2xl border-[10px] ${
          isIphone ? 'border-slate-800 ring-1 ring-slate-700/50' : 'border-slate-900 ring-1 ring-slate-800'
        } flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Device Top Status Bar */}
        <div className="bg-black/90 backdrop-blur-md text-white px-6 pt-3 pb-2 flex justify-between items-center z-50 text-xs font-medium select-none">
          {/* Time */}
          <span>9:41</span>

          {/* Notch or Camera Cutout */}
          {isIphone ? (
            <div className="w-28 h-5 bg-black rounded-full border border-slate-800 flex items-center justify-end px-2 space-x-1">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800"></div>
              <div className="w-2 h-2 rounded-full bg-blue-900/60"></div>
            </div>
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 ring-2 ring-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
            </div>
          )}

          {/* Icons */}
          <div className="flex items-center space-x-1.5 text-slate-200">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Mobile Viewport Screen */}
        <div className="flex-1 relative overflow-hidden bg-slate-950 flex flex-col text-slate-100">
          {children}
        </div>

        {/* Device Bottom Indicator Bar */}
        <div className="bg-black py-2.5 flex items-center justify-center z-50 select-none">
          {isIphone ? (
            <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
          ) : (
            <div className="flex items-center justify-center space-x-12 text-slate-500 text-xs font-semibold">
              <span className="hover:text-slate-300 transition-colors">◀</span>
              <span className="w-3 h-3 rounded-full border-2 border-slate-500 hover:border-slate-300"></span>
              <span className="w-3 h-3 border-2 border-slate-500 rounded-sm hover:border-slate-300"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
