export interface Credentials {
  server: string;
  username: string;
  password: string;
}

export interface UserInfo {
  username: string;
  status: string;
  exp_date: string;
  max_connections: string;
  active_cons: string;
  created_at: string;
  is_trial: string;
}

export interface AuthResponse {
  user_info: UserInfo;
  server_info: {
    url: string;
    port: string;
    rtmp_port: string;
    timezone: string;
    timestamp_now: number;
    time_now: string;
  };
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface LiveStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  category_ids: number[];
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
}

export interface VODStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  rating: string;
  rating_5based: number;
  added: string;
  category_id: string;
  container_extension: string;
  direct_source: string;
}

export interface Series {
  series_id: number;
  name: string;
  cover: string;
  plot: string;
  cast: string;
  director: string;
  genre: string;
  releaseDate: string;
  rating: string;
  rating_5based: number;
  backdrop_path: string[];
  youtube_trailer: string;
  episode_run_time: string;
  category_id: string;
}

export type StreamType = 'live' | 'vod' | 'series';

export interface AppState {
  credentials: Credentials | null;
  isAuthenticated: boolean;
  activeTab: StreamType;
  selectedCategory: string;
  selectedStream: LiveStream | VODStream | null;
  searchQuery: string;
}
