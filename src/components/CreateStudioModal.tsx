import React, { useState, useRef } from 'react';
import { VideoItem, Creator } from '../types';
import { Video, Camera, Upload, Sparkles, Film, Check, Loader2, Music, X } from 'lucide-react';
import { generateReelIdea } from '../services/geminiService';

interface CreateStudioModalProps {
  currentUser: Creator;
  onPublishVideo: (newVideo: VideoItem) => void;
  onClose: () => void;
}

export const CreateStudioModal: React.FC<CreateStudioModalProps> = ({
  currentUser,
  onPublishVideo,
  onClose,
}) => {
  const [contentType, setContentType] = useState<'reel' | 'video'>('reel');
  const [sourceMode, setSourceMode] = useState<'upload' | 'camera' | 'sample'>('upload');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtagsStr, setHashtagsStr] = useState('Reels, Viral, Trending');
  const [audioTrackName, setAudioTrackName] = useState('Original Audio - ' + currentUser.name);
  const [category, setCategory] = useState('Tech');
  const [videoFileUrl, setVideoFileUrl] = useState<string>('');
  const [posterUrl, setPosterUrl] = useState<string>('');

  // AI Assistant State
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [scriptOutline, setScriptOutline] = useState('');

  // Webcam State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const sampleVideos = [
    {
      label: 'Cyberpunk City Lightshow (9:16 Reel)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    },
    {
      label: 'Mountain Adventure (9:16 Reel)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      poster: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    },
    {
      label: 'Big Buck Animation (16:9 Long Video)',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    },
  ];

  // Handle local video upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoFileUrl(url);
      setPosterUrl('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600');
    }
  };

  // Start Camera Stream
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access failed or permission denied.');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoFileUrl(url);
      setPosterUrl('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=600');
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  // AI Gemini Generation
  const handleAiGenerate = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingAi(true);
    try {
      const result = await generateReelIdea(aiTopic);
      setTitle(result.title);
      setDescription(result.description);
      setHashtagsStr(result.hashtags.join(', '));
      setScriptOutline(result.scriptOutline);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Submit Video
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title for your video.');
      return;
    }

    const finalVideoUrl = videoFileUrl || sampleVideos[0].url;
    const finalPosterUrl = posterUrl || sampleVideos[0].poster;

    const hashtagsArr = hashtagsStr
      .split(',')
      .map((tag) => tag.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newVideo: VideoItem = {
      id: `created_${Date.now()}`,
      type: contentType,
      title: title.trim(),
      description: description.trim() || 'Created with ReelVerse Studio!',
      videoUrl: finalVideoUrl,
      posterUrl: finalPosterUrl,
      creator: currentUser,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 12,
      durationSeconds: contentType === 'reel' ? 20 : 180,
      category,
      hashtags: hashtagsArr.length > 0 ? hashtagsArr : ['ReelVerse', 'Creator'],
      audioTrackName,
      createdAt: 'Just now',
      isLiked: true,
      comments: [],
    };

    onPublishVideo(newVideo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col text-slate-100 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Creator Studio</h2>
              <p className="text-xs text-slate-400">Upload, record or AI-generate Reels & Videos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handlePublish} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Format Selection: Reel 9:16 vs Long Video 16:9 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setContentType('reel')}
                className={`p-3.5 rounded-2xl border flex items-center space-x-3 transition-all ${
                  contentType === 'reel'
                    ? 'bg-rose-500/10 border-rose-500 text-rose-300 ring-1 ring-rose-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-12 bg-slate-800 rounded-md border border-slate-700 flex items-center justify-center text-[10px] font-mono">
                  9:16
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm block">Vertical Reel</span>
                  <span className="text-[11px] text-slate-400">Shorts, TikTok, Reels</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setContentType('video')}
                className={`p-3.5 rounded-2xl border flex items-center space-x-3 transition-all ${
                  contentType === 'video'
                    ? 'bg-sky-500/10 border-sky-500 text-sky-300 ring-1 ring-sky-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-12 h-8 bg-slate-800 rounded-md border border-slate-700 flex items-center justify-center text-[10px] font-mono">
                  16:9
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm block">Widescreen Video</span>
                  <span className="text-[11px] text-slate-400">YouTube style tutorial</span>
                </div>
              </button>
            </div>
          </div>

          {/* Media Input Mode Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Video Source
            </label>
            <div className="flex border-b border-slate-800 mb-3">
              <button
                type="button"
                onClick={() => setSourceMode('upload')}
                className={`pb-2 px-4 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition-colors ${
                  sourceMode === 'upload' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>File Upload</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSourceMode('camera');
                  startCamera();
                }}
                className={`pb-2 px-4 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition-colors ${
                  sourceMode === 'camera' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Webcam Record</span>
              </button>

              <button
                type="button"
                onClick={() => setSourceMode('sample')}
                className={`pb-2 px-4 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition-colors ${
                  sourceMode === 'sample' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Sample Clips</span>
              </button>
            </div>

            {/* Upload Area */}
            {sourceMode === 'upload' && (
              <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 bg-slate-950 text-center transition-colors">
                {videoFileUrl ? (
                  <div className="space-y-3">
                    <video src={videoFileUrl} controls className="max-h-48 mx-auto rounded-xl border border-slate-800" />
                    <p className="text-xs text-emerald-400 font-semibold">✓ Video file ready!</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-200">Drag & Drop MP4 / WEBM video file</p>
                    <p className="text-xs text-slate-500 mt-1">or browse from your device</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="mt-3 text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Webcam Record Area */}
            {sourceMode === 'camera' && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  muted
                  className="max-h-56 mx-auto rounded-xl border border-slate-800 bg-black object-cover"
                />
                <div className="flex items-center justify-center space-x-3">
                  {!isRecording ? (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg"
                    >
                      <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                      <span>Start Recording</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-2"
                    >
                      <div className="w-3 h-3 bg-rose-500" />
                      <span>Stop & Save Recording</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Sample Selector Area */}
            {sourceMode === 'sample' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sampleVideos.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setVideoFileUrl(sample.url);
                      setPosterUrl(sample.poster);
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      videoFileUrl === sample.url
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img src={sample.poster} alt={sample.label} className="w-full h-16 object-cover rounded-lg mb-1.5" />
                    <span className="font-semibold line-clamp-1">{sample.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* AI Content Generator Sparkle Bar */}
          <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-slate-950 p-4 rounded-2xl border border-purple-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Gemini AI Studio Assistant
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Auto-Title & Script</span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter topic e.g. 'Top 3 AI Productivity Hacks'"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 flex-1 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleAiGenerate}
                disabled={isGeneratingAi || !aiTopic.trim()}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs disabled:opacity-50 flex items-center space-x-1.5"
              >
                {isGeneratingAi ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Idea</span>
                  </>
                )}
              </button>
            </div>

            {scriptOutline && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-purple-500/20 text-xs text-slate-300 whitespace-pre-line font-mono">
                <p className="font-bold text-purple-300 mb-1">Generated Script Outline:</p>
                {scriptOutline}
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Video Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. 5 Coding Tricks You Didn't Know! 🚀"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Caption / Description</label>
              <textarea
                rows={3}
                placeholder="Write a brief caption explaining your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Hashtags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Reels, Tech, Viral"
                  value={hashtagsStr}
                  onChange={(e) => setHashtagsStr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Audio Track Name</label>
                <div className="relative">
                  <Music className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={audioTrackName}
                    onChange={(e) => setAudioTrackName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-sky-600 hover:from-emerald-600 hover:to-sky-700 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/20 transition-all"
          >
            <Check className="w-5 h-5" />
            <span>Publish {contentType === 'reel' ? 'Reel' : 'Video'} Now</span>
          </button>
        </form>
      </div>
    </div>
  );
};
