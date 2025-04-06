import React, { useState, useRef, useEffect } from "react";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";
import { FiRepeat } from "react-icons/fi";
import { ImShuffle } from "react-icons/im";
import { useSongs } from "../../store/SongContext";

interface Song {
  _id: string;
  title: string;
  artist: {  
    _id: string;
    firstName: string;
    lastName: string;
  };
  thumbnail: string;
  track: string;
  likes: number;
}

const MusicPlayer: React.FC = () => {
  const { songs, currentSong, isPlaying, playSong, togglePlay } = useSongs();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [liked, setLiked] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hover, setHover] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Audio control effects
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;

    const audio = audioRef.current;
    
    if (audio.src !== currentSong.track) {
      audio.pause();
      audio.src = currentSong.track;
      audio.load();
    }

    audio.volume = volume;
    audio.loop = isRepeating;

    const handlePlayback = async () => {
      try {
        isPlaying ? await audio.play() : audio.pause();
      } catch (error) {
        console.error("Audio playback error:", error);
      }
    };

    handlePlayback();

    return () => {
      audio.pause();
    };
  }, [currentSong, isPlaying, volume, isRepeating]);

  // Playback controls
  const togglePlayPause = () => {
    if (!currentSong) return;
    togglePlay();
  };

  const handleNext = () => {
    if (!songs.length) return;

    const currentIndex = songs.findIndex(song => song._id === currentSong?._id);
    let nextIndex = currentIndex;

    if (isShuffling) {
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentIndex && songs.length > 1);
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }

    playSong(songs[nextIndex]);
  };

  const handlePrev = () => {
    if (!songs.length) return;

    const currentIndex = songs.findIndex(song => song._id === currentSong?._id);
    let prevIndex = currentIndex;

    if (isShuffling) {
      do {
        prevIndex = Math.floor(Math.random() * songs.length);
      } while (prevIndex === currentIndex && songs.length > 1);
    } else {
      prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    }

    playSong(songs[prevIndex]);
  };

  // Progress controls
  const handleTimeUpdate = () => {
    if (audioRef.current && duration > 0) {
      setProgress((audioRef.current.currentTime / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current && duration) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentSong) {
    return (
      <div className="h-16 w-full fixed bottom-0 left-0 bg-[#212121] flex justify-center items-center text-white">
        <p>Select a song to play</p>
      </div>
    );
  }

  return (
    <div
      className="h-16 w-full fixed bottom-0 left-0 z-[1300] bg-[#212121] flex justify-between items-center px-6 transition-all duration-300"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        ref={progressBarRef}
        className="absolute top-0 left-0 w-full h-1 cursor-pointer"
        onClick={handleProgressBarClick}
      >
        <div
          className="h-full bg-[rgba(25,118,210,1)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-white flex items-center gap-3">
        <img
          src={currentSong.thumbnail}
          alt="Cover"
          className="w-12 h-12 rounded-lg"
        />
        <div>
          <h1 className="text-sm font-semibold">{currentSong.title}</h1>
          <h2 className="text-xs text-gray-400">
            {currentSong.artist.firstName} {currentSong.artist.lastName} | <span>{currentSong.likes} likes</span>
          </h2>
        </div>
        <button onClick={() => setLiked(!liked)}>
          {liked ? (
            <FaHeart size={20} className="text-red-500" />
          ) : (
            <FaRegHeart size={20} />
          )}
        </button>
      </div>

      <div className="text-white flex gap-5 items-center">
        <button onClick={handlePrev}>
          <MdSkipPrevious size={25} />
        </button>
        <button onClick={togglePlayPause}>
          {isPlaying ? <IoMdPause size={30} /> : <IoMdPlay size={30} />}
        </button>
        <button onClick={handleNext}>
          <MdSkipNext size={25} />
        </button>
        <div className="text-xs text-gray-300">
          {formatTime((progress / 100) * duration)} / {formatTime(duration)}
        </div>
      </div>

      <div className="text-white flex gap-5 items-center">
        {hover && (
          <input
            type="range"
            value={volume}
            onChange={(e) => {
              const newVolume = parseFloat(e.target.value);
              setVolume(newVolume);
              if (audioRef.current) audioRef.current.volume = newVolume;
            }}
            min="0"
            max="1"
            step="0.01"
            className="w-20 h-1 cursor-pointer fixed right-32 accent-[#1976d2]"
          />
        )}
        <FaVolumeUp />
        <button 
          onClick={() => setIsRepeating(!isRepeating)} 
          className={isRepeating ? "text-blue-500" : ""}
        >
          <FiRepeat />
        </button>
        <button 
          onClick={() => setIsShuffling(!isShuffling)} 
          className={isShuffling ? "text-blue-500" : ""}
        >
          <ImShuffle />
        </button>
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
        onError={() => console.error("Error playing audio")}
      />
    </div>
  );
};

export default MusicPlayer;