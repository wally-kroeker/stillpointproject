import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Flag, MessageSquarePlus, Download, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Annotation {
  id: string;
  timestamp: number;
  text: string;
  created: string;
}

interface DraftAudioPlayerProps {
  audioSrc: string;
  title: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getStorageKey(title: string): string {
  return `draft-annotations-${title}`;
}

function loadAnnotations(title: string): Annotation[] {
  try {
    const raw = localStorage.getItem(getStorageKey(title));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAnnotations(title: string, annotations: Annotation[]): void {
  localStorage.setItem(getStorageKey(title), JSON.stringify(annotations));
  // Fire-and-forget POST to server — localStorage remains primary store
  syncNotesToServer(title, annotations);
}

function syncNotesToServer(title: string, annotations: Annotation[]): void {
  const scene = title.toLowerCase().replace(/\s+/g, '_');
  try {
    fetch('/nothingtoseehere/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene, title, notes: annotations }),
    }).catch(() => { /* best-effort, ignore network errors */ });
  } catch {
    /* ignore */
  }
}

export default function DraftAudioPlayer({ audioSrc, title }: DraftAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);
  const isSeekingRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasBookmark, setHasBookmark] = useState(false);

  // Annotation state
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [pausedAtTime, setPausedAtTime] = useState<number | null>(null);
  const [showNotesList, setShowNotesList] = useState(false);

  // Load annotations on mount
  useEffect(() => {
    setAnnotations(loadAnnotations(title));
  }, [title]);

  // Load bookmark on mount
  useEffect(() => {
    const saved = localStorage.getItem(`audio-bookmark-${title}`);
    if (saved) setHasBookmark(true);
  }, [title]);

  // Audio setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      const saved = localStorage.getItem(`audio-bookmark-${title}`);
      if (saved) audio.currentTime = parseFloat(saved);
    };

    const onTimeUpdate = () => {
      if (!isSeekingRef.current) setCurrentTime(audio.currentTime);
    };

    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [title]);

  // Auto-focus note input when it appears
  useEffect(() => {
    if (showNoteInput && noteInputRef.current) {
      noteInputRef.current.focus();
    }
  }, [showNoteInput]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      // When pausing, show the annotation input
      setPausedAtTime(audio.currentTime);
      setShowNoteInput(true);
    } else {
      // If note input is showing, hide it on resume
      setShowNoteInput(false);
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const seek = useCallback((clientX: number) => {
    const bar = progressRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || duration === 0) return;

    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = percent * duration;

    isSeekingRef.current = true;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setTimeout(() => { isSeekingRef.current = false; }, 100);
  }, [duration]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    seek(e.clientX);
  }, [seek]);

  const handleProgressTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    isSeekingRef.current = true;
    seek(e.touches[0].clientX);
  }, [seek]);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isSeekingRef.current) return;
    seek(e.touches[0].clientX);
  }, [seek]);

  useEffect(() => {
    const handleTouchEnd = () => { isSeekingRef.current = false; };
    window.addEventListener('touchend', handleTouchEnd);
    return () => window.removeEventListener('touchend', handleTouchEnd);
  }, []);

  const toggleBookmark = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const key = `audio-bookmark-${title}`;
    if (hasBookmark) {
      localStorage.removeItem(key);
      setHasBookmark(false);
    } else {
      localStorage.setItem(key, audio.currentTime.toString());
      setHasBookmark(true);
    }
  }, [hasBookmark, title]);

  // Annotation actions
  const saveNote = useCallback(() => {
    if (!noteText.trim() || pausedAtTime === null) return;

    const note: Annotation = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: pausedAtTime,
      text: noteText.trim(),
      created: new Date().toISOString(),
    };

    const updated = [...annotations, note].sort((a, b) => a.timestamp - b.timestamp);
    setAnnotations(updated);
    saveAnnotations(title, updated);
    setNoteText('');
    setShowNoteInput(false);
  }, [noteText, pausedAtTime, annotations, title]);

  const deleteNote = useCallback((id: string) => {
    const updated = annotations.filter(a => a.id !== id);
    setAnnotations(updated);
    saveAnnotations(title, updated);
  }, [annotations, title]);

  const seekToAnnotation = useCallback((timestamp: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = timestamp;
    setCurrentTime(timestamp);
  }, []);

  const dismissNoteInput = useCallback(() => {
    setShowNoteInput(false);
    setNoteText('');
  }, []);

  const exportMarkdown = useCallback(() => {
    if (annotations.length === 0) return;

    const lines = [
      `# Revision Notes: ${title}`,
      `_Exported ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}_`,
      `_${annotations.length} annotation${annotations.length !== 1 ? 's' : ''}_`,
      '',
      '| Time | Note |',
      '|------|------|',
      ...annotations.map(a => `| ${formatTime(a.timestamp)} | ${a.text} |`),
      '',
      '---',
      `Audio: \`${audioSrc}\``,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revision-notes-${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [annotations, title, audioSrc]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Annotation markers on the progress bar
  const annotationMarkers = annotations.map(a => ({
    position: duration > 0 ? (a.timestamp / duration) * 100 : 0,
    id: a.id,
  }));

  return (
    <div className="draft-player-wrapper">
      <style>{`
        .draft-player-wrapper {
          margin: 1.5rem 0 2rem;
          border-radius: 12px;
          background: var(--color-bg-accent);
          border: 1px solid var(--color-border);
          overflow: hidden;
        }

        .draft-player-main {
          padding: 1.25rem 1.5rem;
        }

        .draft-player-title {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .draft-player-controls {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .dp-play-btn {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--color-accent-1);
          color: var(--color-bg);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.15s ease, box-shadow 0.3s ease;
          position: relative;
        }

        /* Invisible touch-target expander (96px effective on desktop) */
        .dp-play-btn::before {
          content: '';
          position: absolute;
          top: -16px;
          left: -16px;
          right: -16px;
          bottom: -16px;
        }

        .dp-play-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 16px rgba(196, 163, 90, 0.3);
        }

        .dp-play-btn:active {
          transform: scale(0.97);
        }

        /* Playing: pulsing green ring */
        .dp-play-btn.is-playing {
          box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.25);
          animation: dp-pulse-green 2s ease-in-out infinite;
        }

        /* Paused: amber ring */
        .dp-play-btn.is-paused {
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.5), 0 0 16px rgba(251, 191, 36, 0.2);
        }

        @keyframes dp-pulse-green {
          0%, 100% { box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.5), 0 0 20px rgba(74, 222, 128, 0.25); }
          50% { box-shadow: 0 0 0 6px rgba(74, 222, 128, 0.3), 0 0 30px rgba(74, 222, 128, 0.15); }
        }

        .dp-progress-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          min-width: 0;
        }

        .dp-progress-bar {
          width: 100%;
          height: 8px;
          background: var(--color-border);
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          user-select: none;
        }

        .dp-progress-bar:hover {
          height: 10px;
        }

        .dp-progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: var(--color-accent-1);
          border-radius: 4px;
          transition: width 0.05s linear;
        }

        .dp-annotation-marker {
          position: absolute;
          top: -2px;
          bottom: -2px;
          width: 3px;
          background: var(--color-accent-2);
          border-radius: 2px;
          z-index: 2;
          pointer-events: none;
        }

        .dp-time-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .dp-side-controls {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex-shrink: 0;
        }

        .dp-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.15s ease;
          min-width: 36px;
          min-height: 36px;
        }

        .dp-btn:hover {
          color: var(--color-text);
          background: rgba(255, 255, 255, 0.05);
        }

        .dp-btn.active {
          color: var(--color-accent-1);
        }

        .dp-btn.accent {
          color: var(--color-accent-2);
        }

        /* Note input panel */
        .dp-note-panel {
          padding: 1rem 1.5rem 1.25rem;
          background: rgba(107, 158, 133, 0.08);
          border-top: 1px solid rgba(107, 158, 133, 0.2);
        }

        .dp-note-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .dp-note-timestamp {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-accent-2);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dp-note-actions {
          display: flex;
          gap: 0.5rem;
        }

        .dp-note-textarea {
          width: 100%;
          min-height: 60px;
          padding: 0.75rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          color: var(--color-text);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          line-height: 1.5;
          resize: vertical;
          outline: none;
          box-sizing: border-box;
        }

        .dp-note-textarea:focus {
          border-color: var(--color-accent-2);
          box-shadow: 0 0 0 2px rgba(107, 158, 133, 0.2);
        }

        .dp-note-textarea::placeholder {
          color: var(--color-text-muted);
          opacity: 0.6;
        }

        .dp-save-btn {
          margin-top: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: var(--color-accent-2);
          color: var(--color-bg);
          border: none;
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .dp-save-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .dp-save-btn:disabled {
          opacity: 0.4;
          cursor: default;
          transform: none;
        }

        .dp-dismiss-btn {
          margin-top: 0.5rem;
          margin-left: 0.5rem;
          padding: 0.5rem 1rem;
          background: none;
          color: var(--color-text-muted);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-family: var(--font-sans);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .dp-dismiss-btn:hover {
          color: var(--color-text);
          border-color: var(--color-text-muted);
        }

        /* Notes list panel */
        .dp-notes-list {
          padding: 0 1.5rem 1.25rem;
          border-top: 1px solid var(--color-border);
        }

        .dp-notes-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
        }

        .dp-notes-title {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .dp-note-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.6rem 0;
          border-bottom: 1px solid var(--color-border);
          align-items: flex-start;
        }

        .dp-note-item:last-child {
          border-bottom: none;
        }

        .dp-note-time-btn {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-accent-2);
          background: rgba(107, 158, 133, 0.1);
          border: 1px solid rgba(107, 158, 133, 0.2);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .dp-note-time-btn:hover {
          background: rgba(107, 158, 133, 0.2);
          border-color: var(--color-accent-2);
        }

        .dp-note-text {
          flex: 1;
          font-size: 0.9rem;
          color: var(--color-text);
          line-height: 1.5;
        }

        .dp-note-delete {
          flex-shrink: 0;
          background: none;
          border: none;
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 2px;
          opacity: 0.4;
          transition: all 0.15s ease;
        }

        .dp-note-delete:hover {
          color: #ef4444;
          opacity: 1;
        }

        .dp-empty-notes {
          color: var(--color-text-muted);
          font-size: 0.85rem;
          font-style: italic;
          padding: 0.5rem 0;
        }

        @media (max-width: 640px) {
          .draft-player-main {
            padding: 1rem;
          }
          .dp-play-btn {
            width: 96px;
            height: 96px;
          }
          /* 128px effective touch target on mobile */
          .dp-play-btn::before {
            top: -16px;
            left: -16px;
            right: -16px;
            bottom: -16px;
          }
          /* Hide mute and bookmark on mobile, keep only play + progress + note count */
          .dp-side-controls .dp-btn:not(:last-child) {
            display: none;
          }
          .dp-note-panel {
            padding: 0.75rem 1rem 1rem;
          }
          .dp-notes-list {
            padding: 0 1rem 1rem;
          }
        }
      `}</style>

      <div className="draft-player-main">
        <div className="draft-player-title">
          <span>Draft Review Player</span>
          {annotations.length > 0 && (
            <span>{annotations.length} note{annotations.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        <div className="draft-player-controls">
          {/* Play/Pause — large button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className={`dp-play-btn ${isPlaying ? 'is-playing' : 'is-paused'}`}
            type="button"
          >
            {isPlaying
              ? <Pause size={28} />
              : <Play size={28} style={{ marginLeft: '3px' }} />
            }
          </button>

          {/* Progress section */}
          <div className="dp-progress-section">
            <div
              ref={progressRef}
              className="dp-progress-bar"
              onClick={handleProgressClick}
              onTouchStart={handleProgressTouch}
              onTouchMove={handleTouchMove}
              role="slider"
              aria-label="Seek"
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
            >
              <div className="dp-progress-fill" style={{ width: `${progress}%` }} />
              {/* Annotation markers on progress bar */}
              {annotationMarkers.map(m => (
                <div
                  key={m.id}
                  className="dp-annotation-marker"
                  style={{ left: `${m.position}%` }}
                />
              ))}
            </div>
            <div className="dp-time-row">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
            </div>
          </div>

          {/* Side controls */}
          <div className="dp-side-controls">
            <button
              onClick={toggleBookmark}
              className={`dp-btn ${hasBookmark ? 'active' : ''}`}
              type="button"
              title={hasBookmark ? 'Remove bookmark' : 'Save position'}
              aria-label={hasBookmark ? 'Remove bookmark' : 'Save position'}
            >
              <Flag size={16} />
            </button>
            <button
              onClick={toggleMute}
              className="dp-btn"
              type="button"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button
              onClick={() => setShowNotesList(!showNotesList)}
              className={`dp-btn ${showNotesList ? 'accent' : ''}`}
              type="button"
              title={`${annotations.length} notes`}
              aria-label="Toggle notes list"
            >
              {showNotesList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={audioSrc} crossOrigin="anonymous" />

      {/* Annotation input — appears on pause */}
      {showNoteInput && pausedAtTime !== null && (
        <div className="dp-note-panel">
          <div className="dp-note-header">
            <div className="dp-note-timestamp">
              <MessageSquarePlus size={14} />
              <span>Note at {formatTime(pausedAtTime)}</span>
            </div>
          </div>
          <textarea
            ref={noteInputRef}
            className="dp-note-textarea"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="What needs fixing here? (dictate or type)"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                saveNote();
              }
            }}
          />
          <div>
            <button
              className="dp-save-btn"
              onClick={saveNote}
              disabled={!noteText.trim()}
              type="button"
            >
              Save Note
            </button>
            <button
              className="dp-dismiss-btn"
              onClick={dismissNoteInput}
              type="button"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {showNotesList && (
        <div className="dp-notes-list">
          <div className="dp-notes-header">
            <span className="dp-notes-title">
              Revision Notes ({annotations.length})
            </span>
            {annotations.length > 0 && (
              <button
                className="dp-btn accent"
                onClick={exportMarkdown}
                type="button"
                title="Export as Markdown"
                aria-label="Export notes as markdown"
              >
                <Download size={14} />
              </button>
            )}
          </div>
          {annotations.length === 0 ? (
            <p className="dp-empty-notes">No notes yet. Pause playback to add one.</p>
          ) : (
            annotations.map(note => (
              <div key={note.id} className="dp-note-item">
                <button
                  className="dp-note-time-btn"
                  onClick={() => seekToAnnotation(note.timestamp)}
                  type="button"
                  title="Jump to this timestamp"
                >
                  {formatTime(note.timestamp)}
                </button>
                <span className="dp-note-text">{note.text}</span>
                <button
                  className="dp-note-delete"
                  onClick={() => deleteNote(note.id)}
                  type="button"
                  title="Delete note"
                  aria-label="Delete note"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
