'use client';

import { useState, useEffect, useMemo } from 'react';
import { Credentials, Category, LiveStream, VODStream, Series, StreamType } from '@/lib/types';
import {
  getLiveCategories, getLiveStreams,
  getVODCategories, getVODStreams,
  getSeriesCategories, getSeries as getSeriesData,
  getLiveStreamURL, getVODStreamURL,
} from '@/lib/api';
import ChannelCard from './ChannelCard';
import VideoPlayer from './VideoPlayer';
import {
  Tv, Film, BookOpen, Search, LogOut, Loader2,
  ChevronRight, Menu, X, SlidersHorizontal,
} from 'lucide-react';

interface DashboardProps {
  credentials: Credentials;
  onLogout: () => void;
}

type TabData = {
  categories: Category[];
  streams: LiveStream[] | VODStream[] | Series[];
  loading: boolean;
  loaded: boolean;
};

export default function Dashboard({ credentials, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<StreamType>('live');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [playingStream, setPlayingStream] = useState<{ url: string; title: string; logo?: string } | null>(null);

  const [liveData, setLiveData] = useState<TabData>({ categories: [], streams: [], loading: false, loaded: false });
  const [vodData, setVodData] = useState<TabData>({ categories: [], streams: [], loading: false, loaded: false });
  const [seriesData, setSeriesData] = useState<TabData>({ categories: [], streams: [], loading: false, loaded: false });

  const loadTab = async (tab: StreamType) => {
    if (tab === 'live' && !liveData.loaded) {
      setLiveData(d => ({ ...d, loading: true }));
      try {
        const [cats, streams] = await Promise.all([getLiveCategories(credentials), getLiveStreams(credentials)]);
        setLiveData({ categories: cats, streams, loading: false, loaded: true });
      } catch { setLiveData(d => ({ ...d, loading: false, loaded: true })); }
    }
    if (tab === 'vod' && !vodData.loaded) {
      setVodData(d => ({ ...d, loading: true }));
      try {
        const [cats, streams] = await Promise.all([getVODCategories(credentials), getVODStreams(credentials)]);
        setVodData({ categories: cats, streams, loading: false, loaded: true });
      } catch { setVodData(d => ({ ...d, loading: false, loaded: true })); }
    }
    if (tab === 'series' && !seriesData.loaded) {
      setSeriesData(d => ({ ...d, loading: true }));
      try {
        const [cats, streams] = await Promise.all([getSeriesCategories(credentials), getSeriesData(credentials)]);
        setSeriesData({ categories: cats, streams, loading: false, loaded: true });
      } catch { setSeriesData(d => ({ ...d, loading: false, loaded: true })); }
    }
  };

  useEffect(() => { loadTab('live'); }, []);

  const switchTab = (tab: StreamType) => {
    setActiveTab(tab);
    setSelectedCategory('all');
    setSearchQuery('');
    loadTab(tab);
  };

  const currentData = activeTab === 'live' ? liveData : activeTab === 'vod' ? vodData : seriesData;

  const filteredStreams = useMemo(() => {
    let streams = currentData.streams as (LiveStream | VODStream | Series)[];
    if (selectedCategory !== 'all') {
      streams = streams.filter(s => {
        const catId = 'category_ids' in s
          ? (s as LiveStream).category_id
          : 'category_id' in s
            ? (s as VODStream | Series).category_id
            : '';
        return catId === selectedCategory;
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      streams = streams.filter(s => s.name.toLowerCase().includes(q));
    }
    return streams;
  }, [currentData.streams, selectedCategory, searchQuery]);

  const handlePlay = (stream: LiveStream | VODStream | Series) => {
    if (activeTab === 'live') {
      const s = stream as LiveStream;
      setPlayingStream({
        url: getLiveStreamURL(credentials, s.stream_id),
        title: s.name,
        logo: s.stream_icon,
      });
    } else if (activeTab === 'vod') {
      const s = stream as VODStream;
      setPlayingStream({
        url: getVODStreamURL(credentials, s.stream_id, s.container_extension || 'mp4'),
        title: s.name,
        logo: s.stream_icon,
      });
    }
  };

  const tabs = [
    { id: 'live' as StreamType, label: 'Live TV', icon: Tv },
    { id: 'vod' as StreamType, label: 'Movies', icon: Film },
    { id: 'series' as StreamType, label: 'Series', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Top nav */}
      <header className="h-14 bg-[#0d0d18] border-b border-white/5 flex items-center px-4 gap-4 sticky top-0 z-40">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-gray-400" /> : <Menu className="w-5 h-5 text-gray-400" />}
        </button>

        <div className="flex items-center gap-2">
          <Tv className="w-5 h-5 text-brand-500" />
          <span className="text-white font-bold text-lg">StreamFlow</span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 ml-4 bg-white/5 rounded-xl p-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels…"
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500/50 w-52 transition-all"
          />
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-56' : 'w-0'
          } transition-all duration-300 overflow-hidden bg-[#0d0d18] border-r border-white/5 flex-shrink-0`}
        >
          <div className="w-56 p-3">
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</span>
            </div>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors mb-0.5 ${
                selectedCategory === 'all'
                  ? 'bg-brand-600/20 text-brand-400 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>All {activeTab === 'live' ? 'Channels' : activeTab === 'vod' ? 'Movies' : 'Series'}</span>
              <span className="text-xs bg-white/10 rounded-md px-1.5 py-0.5">{currentData.streams.length}</span>
            </button>

            {currentData.categories.map(cat => {
              const count = currentData.streams.filter(s => {
                const catId = 'category_ids' in s
                  ? (s as LiveStream).category_id
                  : (s as VODStream | Series).category_id;
                return catId === cat.category_id;
              }).length;

              return (
                <button
                  key={cat.category_id}
                  onClick={() => setSelectedCategory(cat.category_id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors mb-0.5 ${
                    selectedCategory === cat.category_id
                      ? 'bg-brand-600/20 text-brand-400 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{cat.category_name}</span>
                  {count > 0 && (
                    <span className="text-xs bg-white/10 rounded-md px-1.5 py-0.5 ml-1 shrink-0">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">
          {/* Mobile search */}
          <div className="sm:hidden mb-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-500/50"
            />
          </div>

          {/* Header row */}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-white font-semibold">
              {selectedCategory === 'all'
                ? `All ${activeTab === 'live' ? 'Channels' : activeTab === 'vod' ? 'Movies' : 'Series'}`
                : currentData.categories.find(c => c.category_id === selectedCategory)?.category_name || 'Category'}
            </h2>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-gray-500 text-sm">{filteredStreams.length} items</span>
          </div>

          {/* Loading state */}
          {currentData.loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-gray-500 text-sm">Loading content…</p>
            </div>
          )}

          {/* Empty state */}
          {!currentData.loading && filteredStreams.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="text-5xl">📭</div>
              <p className="text-gray-400 font-medium">No results found</p>
              <p className="text-gray-600 text-sm">Try a different category or search term</p>
            </div>
          )}

          {/* Grid */}
          {!currentData.loading && filteredStreams.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredStreams.map((stream) => {
                const s = stream as LiveStream | VODStream;
                return (
                  <ChannelCard
                    key={s.stream_id}
                    stream={s}
                    type={activeTab === 'live' ? 'live' : 'vod'}
                    onClick={() => handlePlay(stream as LiveStream | VODStream)}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Video Player Modal */}
      {playingStream && (
        <VideoPlayer
          url={playingStream.url}
          title={playingStream.title}
          logo={playingStream.logo}
          onClose={() => setPlayingStream(null)}
        />
      )}
    </div>
  );
}
