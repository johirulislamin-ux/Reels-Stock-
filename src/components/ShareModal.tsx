import React, { useState } from 'react';
import { VideoItem } from '../types';
import { X, Copy, Check, Share2, Send, MessageSquare, Twitter, Facebook, Code } from 'lucide-react';
import { formatNumber } from '../utils/helpers';

interface ShareModalProps {
  video: VideoItem | null;
  onClose: () => void;
  onShareSuccess?: (videoId: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ video, onClose, onShareSuccess }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'link' | 'embed'>('link');

  if (!video) return null;

  const shareUrl = `${window.location.origin}/#reel-${video.id}`;
  const embedCode = `<iframe width="315" height="560" src="${shareUrl}/embed" frameborder="0" allowfullscreen></iframe>`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onShareSuccess) onShareSuccess(video.id);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSocialClick = (platform: string) => {
    if (onShareSuccess) onShareSuccess(video.id);
    const text = encodeURIComponent(`Watch "${video.title}" by ${video.creator.name} on ReelVerse!`);
    let url = '';

    switch (platform) {
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${text}%20${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        break;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-slate-100 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Share Reel</h3>
            <p className="text-xs text-slate-400">Spread the vibe with friends and followers</p>
          </div>
        </div>

        {/* Video Preview Card */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-3 mb-5">
          <img
            src={video.posterUrl}
            alt={video.title}
            className="w-14 h-18 object-cover rounded-lg border border-slate-800 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-200 truncate">{video.title}</h4>
            <p className="text-xs text-slate-400 truncate">{video.creator.name} • {formatNumber(video.viewsCount)} views</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                {video.type === 'reel' ? '9:16 Reel' : '16:9 Video'}
              </span>
              <span className="text-[10px] text-slate-500">{video.sharesCount} shares</span>
            </div>
          </div>
        </div>

        {/* Tabs: Link vs Embed */}
        <div className="flex border-b border-slate-800 mb-4">
          <button
            onClick={() => setActiveTab('link')}
            className={`pb-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'link'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Direct Link & Socials
          </button>
          <button
            onClick={() => setActiveTab('embed')}
            className={`pb-2 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'embed'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Embed Code
          </button>
        </div>

        {activeTab === 'link' ? (
          <>
            {/* Quick Copy Link Input */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Shareable Link</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 flex-1 focus:outline-none select-all"
                />
                <button
                  onClick={() => handleCopy(shareUrl)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Social Media Shortcut Icons */}
            <div>
              <p className="text-xs font-medium text-slate-400 mb-2.5">Share directly to platform</p>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => handleSocialClick('whatsapp')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 transition-all group"
                >
                  <MessageSquare className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-slate-300 font-medium">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleSocialClick('twitter')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 hover:bg-sky-950/40 border border-slate-800 hover:border-sky-500/40 text-sky-400 transition-all group"
                >
                  <Twitter className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-slate-300 font-medium">X / Twitter</span>
                </button>

                <button
                  onClick={() => handleSocialClick('facebook')}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/40 text-blue-400 transition-all group"
                >
                  <Facebook className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-slate-300 font-medium">Facebook</span>
                </button>

                <button
                  onClick={() => handleCopy(shareUrl)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-950 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/40 text-purple-400 transition-all group"
                >
                  <Send className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-slate-300 font-medium">Direct Msg</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">HTML Embed Code</label>
            <textarea
              readOnly
              rows={3}
              value={embedCode}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono focus:outline-none mb-3 resize-none"
            />
            <button
              onClick={() => handleCopy(embedCode)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <Code className="w-4 h-4" />
              <span>Copy HTML Embed Snippet</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
