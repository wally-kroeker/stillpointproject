import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Flag } from 'lucide-react';

interface AudioPlayerProps {
  audioSrc: string;
  title: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const DEBUG = true; // Set to true for detailed logging
const log = (msg: string, data?: any) => {
  if (DEBUG) {
    console.log(`[AudioPlayer] ${msg}`, data || '');
  }
};

export default function AudioPlayer({ audioSrc, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isSeekingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasBookmark, setHasBookmark] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [audioState, setAudioState] = useState('uninitialized');

  // Component mount
  useEffect(() => {
    log('Component mounted', { audioSrc, title });
    return () => log('Component unmounting');
  }, [audioSrc, title]);

  // Load bookmark on mount
  useEffect(() => {
    const bookmarkKey = `audio-bookmark-${title}`;
    const saved = localStorage.getItem(bookmarkKey);
    if (saved) {
      log('Bookmark found', { bookmarkKey, time: saved });
      setHasBookmark(true);
    }
  }, [title]);

  // Audio setup and event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      log('ERROR: audioRef.current is null!');
      return;
    }

    log('Setting up audio element', { src: audioSrc });

    // Audio event handlers with detailed logging
    const onLoadStart = () => {
      log('EVENT: loadstart - audio starting to load');
      setAudioState('loading');
    };

    const onLoadedMetadata = () => {
      log('EVENT: loadedmetadata - metadata loaded', {
        duration: audio.duration,
        readyState: audio.readyState,
        networkState: audio.networkState,
      });
      setAudioState('ready');
      setDuration(audio.duration);

      // Restore bookmark if it exists
      const bookmarkKey = `audio-bookmark-${title}`;
      const saved = localStorage.getItem(bookmarkKey);
      if (saved) {
        audio.currentTime = parseFloat(saved);
        log('Restored bookmark', { time: audio.currentTime });
      }
    };

    const onLoadedData = () => {
      log('EVENT: loadeddata');
    };

    const onCanPlay = () => {
      log('EVENT: canplay - audio is ready to play');
    };

    const onTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onPlay = () => {
      log('EVENT: play');
    };

    const onPause = () => {
      log('EVENT: pause');
    };

    const onEnded = () => {
      log('EVENT: ended');
      setIsPlaying(false);
    };

    const onError = () => {
      log('EVENT: error - Audio loading failed!', {
        error: audio.error?.code,
        errorMessage: audio.error?.message,
        networkState: audio.networkState,
        readyState: audio.readyState,
      });
      setAudioState('error');
    };

    const onProgress = () => {
      log('EVENT: progress', {
        buffered: audio.buffered.length > 0 ? `${audio.buffered.end(0)}s` : 'none',
      });
    };

    // Attach event listeners
    log('Attaching event listeners...');
    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('loadeddata', onLoadedData);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('progress', onProgress);

    // Force load
    log('Calling audio.load()...');
    try {
      audio.load();
      log('audio.load() called successfully');
    } catch (e) {
      log('ERROR calling audio.load()', e);
    }

    return () => {
      log('Cleaning up audio event listeners');
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('loadeddata', onLoadedData);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('progress', onProgress);
    };
  }, [title]);

  // Play/pause toggle
  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      log('ERROR: Cannot toggle play - audioRef is null');
      return;
    }

    if (isPlaying) {
      log('Pausing audio');
      audio.pause();
      setIsPlaying(false);
    } else {
      log('Playing audio');
      audio.play().catch(e => {
        log('ERROR: play() failed', e);
      });
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Mute toggle
  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
    log('Mute toggled', { muted: !isMuted });
  }, [isMuted]);

  // Handle seeking
  const seek = useCallback((clientX: number) => {
    const bar = progressRef.current;
    const audio = audioRef.current;

    log('Seek called', { clientX, duration, audioExists: !!audio, barExists: !!bar });

    if (!bar || !audio) {
      log('ERROR: Missing bar or audio element');
      return;
    }

    if (duration === 0) {
      log('ERROR: Duration is 0 - cannot seek');
      return;
    }

    const rect = bar.getBoundingClientRect();
    log('Progress bar rect', { left: rect.left, width: rect.width });

    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = percent * duration;

    log('Seeking calculation', { percent, newTime, clientX, rectLeft: rect.left, rectWidth: rect.width });

    try {
      isSeekingRef.current = true;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      log('Seek successful', { newTime });
      // Resume normal updates after a brief delay to allow seek to settle
      setTimeout(() => {
        isSeekingRef.current = false;
      }, 100);
    } catch (e) {
      log('ERROR: Seek failed', e);
      isSeekingRef.current = false;
    }
  }, [duration]);

  // Progress bar click handler
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    log('CLICK on progress bar', { clientX: e.clientX });
    seek(e.clientX);
  }, [seek]);

  // Touch handlers
  const handleProgressTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    log('TOUCH START on progress bar');
    const clientX = e.touches[0].clientX;
    isSeekingRef.current = true;
    seek(clientX);
  }, [seek]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSeekingRef.current) return;
    const clientX = e.touches[0].clientX;
    seek(clientX);
  }, [seek]);

  // Bookmark toggle
  const toggleBookmark = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const bookmarkKey = `audio-bookmark-${title}`;
    if (hasBookmark) {
      localStorage.removeItem(bookmarkKey);
      setHasBookmark(false);
      log('Bookmark removed');
    } else {
      localStorage.setItem(bookmarkKey, audio.currentTime.toString());
      setHasBookmark(true);
      log('Bookmark saved', { time: audio.currentTime });
    }
  }, [hasBookmark, title]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Touch end handler
  useEffect(() => {
    const handleTouchEnd = () => {
      isSeekingRef.current = false;
    };

    if (isSeekingRef.current) {
      window.addEventListener('touchend', handleTouchEnd);
      return () => window.removeEventListener('touchend', handleTouchEnd);
    }
  }, []);

  // DEBUG: Log state changes
  useEffect(() => {
    log('STATE CHANGED', { duration, currentTime, isPlaying, audioState });
  }, [duration, currentTime, isPlaying, audioState]);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: 'linear-gradient(to top, var(--color-bg), transparent 0%, var(--color-bg) 40%)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--color-border)',
      padding: '1rem',
      boxSizing: 'border-box',
    }}>
      <style>{`
        .audio-player-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          background: var(--color-border);
          border-radius: 3px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          user-select: none;
        }

        .progress-bar:hover {
          height: 8px;
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--color-accent-1);
          border-radius: 3px;
          transition: width 0.05s linear;
        }

        .player-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 4px;
          flex-shrink: 0;
          transition: color 0.2s;
          min-width: 36px;
          min-height: 36px;
        }

        .player-button:hover {
          color: var(--color-text);
        }

        .play-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-accent-1);
          color: var(--color-bg);
        }

        .play-button:hover {
          color: var(--color-bg);
        }

        .bookmark-button.active {
          color: var(--color-accent-1);
          fill: var(--color-accent-1);
        }

        .time-display {
          font-size: 0.8rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          min-width: 3.5rem;
          flex-shrink: 0;
        }

        .time-display.duration {
          text-align: right;
        }
      `}</style>

      <div className="audio-player-container">
        <audio
          ref={audioRef}
          src={audioSrc}
          crossOrigin="anonymous"
        />

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="player-button play-button"
          type="button"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
        </button>

        {/* Current Time */}
        <span className="time-display">
          {formatTime(currentTime)}
        </span>

        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="progress-bar"
          onClick={handleProgressClick}
          onTouchStart={handleProgressTouch}
          onTouchMove={handleTouchMove}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          title={`${formatTime(currentTime)} / ${formatTime(duration)}`}
        >
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Duration */}
        <span className="time-display duration">
          {duration > 0 ? formatTime(duration) : '--:--'}
        </span>

        {/* Bookmark */}
        <button
          onClick={toggleBookmark}
          aria-label={hasBookmark ? 'Remove bookmark' : 'Add bookmark'}
          className={`player-button bookmark-button ${hasBookmark ? 'active' : ''}`}
          type="button"
          title={hasBookmark ? 'Remove bookmark' : 'Save timestamp'}
        >
          <Flag size={16} />
        </button>

        {/* Mute */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          className="player-button"
          type="button"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* DEBUG: Show audio state */}
        {DEBUG && (
          <span style={{
            fontSize: '0.7rem',
            color: 'var(--color-text-muted)',
            marginLeft: '0.5rem',
            padding: '0.25rem 0.5rem',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '3px',
          }}>
            {audioState}
          </span>
        )}
      </div>
    </div>
  );
}
