
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import type { ShortVideo } from '../types';
import { supabase } from '../lib/supabaseClient';

interface ShortsScreenProps {
    onBack: () => void;
    onNavigateToAuth: () => void;
    onNavigateToCollege: (id: string) => void;
    onNavigateToSpecialty: (id: string) => void;
    onLike?: () => void; // Optional callback for achievements
}

const ShortsScreen: React.FC<ShortsScreenProps> = ({ onBack, onNavigateToAuth, onNavigateToCollege, onNavigateToSpecialty, onLike }) => {
  const [videos, setVideos] = useState<ShortVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Interaction State
  const [likedVideos, setLikedVideos] = useState<{[key: string]: boolean}>({});
  const [likeCounts, setLikeCounts] = useState<{[key: string]: number}>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
      // Get Session
      const getSession = async () => {
          if (supabase) {
              const { data: { session } } = await supabase.auth.getSession();
              setCurrentUser(session?.user || null);
          }
      };
      getSession();

      const fetchData = async () => {
          const data = await api.getShorts();
          setVideos(data);
          setLoading(false);
          
          // Initialize counts
          const initialCounts: any = {};
          data.forEach(v => initialCounts[v.id] = v.likes);
          setLikeCounts(initialCounts);
      };
      fetchData();
  }, []);

  // Load Real Like Status when videos or user changes
  useEffect(() => {
      if (videos.length > 0 && currentUser) {
          videos.forEach(async (video) => {
              const { liked, count } = await api.getLikeStatus(video.id, currentUser.id);
              setLikedVideos(prev => ({...prev, [video.id]: liked}));
              setLikeCounts(prev => ({...prev, [video.id]: count > 0 ? count : video.likes})); // Fallback to mock count if 0
          });
      }
  }, [videos, currentUser]);

  useEffect(() => {
    if (loading || videos.length === 0) return;

    const observerOptions = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoElement = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) {
          const playPromise = videoElement.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              // Autoplay prevented
            });
          }
        } else {
          videoElement.pause();
          videoElement.currentTime = 0;
        }
      });
    }, observerOptions);

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [loading, videos]);


  const toggleMute = () => {
    if (isMuted) {
        // If user is trying to UNMUTE, check global settings
        const globalSound = localStorage.getItem('app_sound_enabled');
        if (globalSound === 'false') {
            // Sound is globally disabled
            const confirmEnable = window.confirm('Звук отключен в настройках приложения. Включить для этого видео?');
            if (!confirmEnable) return;
        }
    }
    setIsMuted(!isMuted);
  };

  const handleVideoClick = (e: React.MouseEvent, index: number) => {
      const video = videoRefs.current[index];
      if (video) {
          if (video.paused) {
              video.play();
          } else {
              video.pause();
          }
      }
  };

  const handleLike = async (videoId: string) => {
      if (!currentUser) {
          onNavigateToAuth();
          return;
      }

      const isLiked = likedVideos[videoId];
      // Optimistic Update
      setLikedVideos(prev => ({...prev, [videoId]: !isLiked}));
      setLikeCounts(prev => ({
          ...prev, 
          [videoId]: isLiked ? prev[videoId] - 1 : prev[videoId] + 1
      }));

      // Trigger achievement callback if it's a new like
      if (!isLiked && onLike) {
          onLike();
      }

      await api.toggleLike(videoId, currentUser.id);
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
        <div 
            ref={containerRef}
            className="absolute inset-0 overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
        >
        {/* Top Controls */}
        <div className="fixed top-4 left-4 z-50 flex items-center gap-4 pointer-events-auto">
            <button 
                onClick={onBack} 
                className="bg-black/30 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <button 
                onClick={toggleMute} 
                className="bg-black/30 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            >
                {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                )}
            </button>
        </div>
        
        {loading && (
            <div className="w-full h-screen flex items-center justify-center bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            </div>
        )}

        {videos.map((video, index) => (
            <div key={video.id} className="w-full h-screen snap-start relative flex items-center justify-center bg-slate-900 border-b border-gray-800">
                
            {/* Video Player */}
            {video.videoUrl ? (
                <video
                    ref={(el) => { videoRefs.current[index] = el; }}
                    src={video.videoUrl}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    muted={isMuted}
                    poster={video.imageUrl}
                    onClick={(e) => handleVideoClick(e, index)}
                />
            ) : (
                <>
                    <img 
                        src={video.imageUrl} 
                        alt={video.title} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white/50 text-sm font-mono border border-white/20 px-3 py-1 rounded-lg backdrop-blur-md">
                            Видео не загружено
                        </p>
                    </div>
                </>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 md:pb-6 flex items-end justify-between pointer-events-none">
                <div className="max-w-[75%] space-y-3 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold shadow-lg ring-2 ring-white/20">
                            {video.author[0]}
                        </div>
                        <span className="font-bold text-white drop-shadow-md text-lg">{video.author}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white drop-shadow-lg leading-tight">{video.title}</h3>
                    <p className="text-slate-200 text-sm drop-shadow-md line-clamp-3 opacity-90">{video.description}</p>
                </div>

                {/* Action Buttons (Right Sidebar) */}
                <div className="flex flex-col items-center gap-6 text-white pointer-events-auto min-w-[60px]">
                    {/* Like Button */}
                    <button 
                        onClick={() => handleLike(video.id)}
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 group-active:scale-90 shadow-lg ${likedVideos[video.id] ? 'bg-red-500/20 text-red-500' : 'bg-black/40 hover:bg-red-500/20 text-white border border-white/10'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-colors ${likedVideos[video.id] ? 'fill-current' : 'fill-transparent stroke-current'}`} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold drop-shadow-md">{likeCounts[video.id] || video.likes}</span>
                    </button>
                    
                    {/* Linked College Button - Moved to Sidebar */}
                    {video.collegeName && video.collegeId && (
                        <button 
                            onClick={() => onNavigateToCollege(video.collegeId!)}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className="p-3 bg-black/40 rounded-full backdrop-blur-md group-hover:bg-blue-500/80 transition-all duration-300 shadow-lg border border-white/10 group-active:scale-90">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-bold drop-shadow-md text-center leading-tight">Колледж</span>
                        </button>
                    )}

                    {/* Linked Specialty Button - Moved to Sidebar */}
                    {video.specialtyTitle && video.specialtyId && (
                        <button 
                            onClick={() => onNavigateToSpecialty(video.specialtyId!)}
                            className="flex flex-col items-center gap-1 group"
                        >
                            <div className="p-3 bg-black/40 rounded-full backdrop-blur-md group-hover:bg-purple-500/80 transition-all duration-300 shadow-lg border border-white/10 group-active:scale-90">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-bold drop-shadow-md text-center leading-tight">Профессия</span>
                        </button>
                    )}
                </div>
            </div>
            </div>
        ))}
        </div>
    </div>
  );
};

export default ShortsScreen;
