'use client';

import { LiveStream, VODStream } from '@/lib/types';
import { Play } from 'lucide-react';

interface ChannelCardProps {
  stream: LiveStream | VODStream;
  onClick: () => void;
  type: 'live' | 'vod';
}

export default function ChannelCard({ stream, onClick, type }: ChannelCardProps) {
  const isLive = type === 'live';

  return (
    <button
      onClick={onClick}
      className="channel-card group relative bg-[#13131f] border border-white/5 rounded-xl overflow-hidden hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-600/10 transition-all duration-200 text-left"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#0a0a14] flex items-center justify-center overflow-hidden">
        {stream.stream_icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={stream.stream_icon}
            alt={stream.name}
            className="w-full h-full object-contain p-3"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${stream.stream_icon ? 'hidden' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <span className="text-2xl">📺</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="channel-overlay absolute inset-0 bg-black/60 opacity-0 flex items-center justify-center transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center shadow-lg">
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* Live badge */}
        {isLive && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
            <span className="relative live-dot w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Live</span>
          </div>
        )}

        {/* VOD rating */}
        {!isLive && (stream as VODStream).rating_5based > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
            <span className="text-yellow-400 text-[10px]">★</span>
            <span className="text-[10px] text-gray-300">{(stream as VODStream).rating_5based.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-white text-sm font-medium truncate leading-tight">{stream.name}</p>
      </div>
    </button>
  );
}
