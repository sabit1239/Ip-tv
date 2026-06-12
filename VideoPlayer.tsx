'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Volume2, VolumeX, Maximize, Minimize, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title: string;
  logo?: string;
  onClose: () => void;
}

export default function VideoPlayer({ url, title, logo, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    let hls: unknown = null;

    const setupPlayer = async () => {
      setLoading(true);
      setError(null);

      if (url.endsWith('.m3u8') || url.includes('.m3u8')) {
        // HLS stream
        const HlsModule = await import('hls.js');
        const Hls = HlsModule.default;

        if (Hls.isSupported()) {
          const hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });
          hls = hlsInstance;
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            video.play().catch(() => {});
          });
          hlsInstance.on(Hls.Events.ERROR, (_: unknown, data: { fatal: boolean; type: string }) => {
            if (data.fatal) {
              setError('Stream unavailable. The channel may be offline.');
              setLoading(false);
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS
          video.src = url;
          video.play().catch(() => {});
          setLoading(false);
        } else {
          setError('HLS not supported in this browser.');
          setLoading(false);
        }
      } else {
        // Direct MP4 or other
        video.src = url;
        video.play().catch(() => {});
        setLoading(false);
      }
    };

    setupPlayer();

    return () => {
      if (hls && typeof (hls as { destroy: () => void }).destroy === 'function') {
        (hls as { destroy: () => void }).destroy();
      }
      video.src = '';
    };
  }, [url]);

  const showControls = () => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!fullscreen) {
      containerRef.current.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div
        ref={containerRef}
        className="relative w-full h-full bg-black"
        onMouseMove={showControls}
        onTouchStart={showControls}
      >
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
            <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
            <p className="text-gray-400 text-sm">Connecting to stream…</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            <div className="text-red-400 text-6xl">⚠</div>
            <p className="text-white text-lg font-medium">Stream Error</p>
            <p className="text-gray-400 text-sm max-w-xs text-center">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-brand-600 hover:bg-brand-700 rounded-lg text-white text-sm transition-colors"
            >
              Go Back
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          autoPlay
          muted={muted}
          onWaiting={() => setLoading(true)}
          onPlaying={() => setLoading(false)}
        />

        {/* Controls overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            controlsVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center gap-3">
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" className="w-8 h-8 object-contain rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
            <span className="text-white font-semibold text-lg truncate flex-1">{title}</span>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="relative w-3 h-3">
                <span className="absolute inset-0 rounded-full bg-red-500" />
              </span>
              <span className="text-red-400 text-xs font-bold uppercase tracking-wider">Live</span>
            </div>
            <div className="flex-1" />
            <button onClick={toggleMute} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              {muted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </button>
            <button onClick={toggleFullscreen} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              {fullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
