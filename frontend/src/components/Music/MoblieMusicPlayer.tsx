import React, { useState, useRef, useEffect } from "react";
import { Box, SwipeableDrawer, Typography } from "@mui/material";
import { FaAngleDown } from "react-icons/fa";
import { IoMdPause, IoMdPlay } from "react-icons/io";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ImShuffle } from "react-icons/im";
import { FiRepeat } from "react-icons/fi";
import { useSongs } from "../../store/SongContext";

const MobileMusicPlayer: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { songs, currentSong, isPlaying, playSong, togglePlay } = useSongs();

  
  // Audio management
  useEffect(() => {
    if (!currentSong || !audioRef.current) return;
  
    const audio = audioRef.current;
  
    if (audio.src !== currentSong.track) {
      audio.pause();
      audio.src = currentSong.track;
      audio.load();
    }
  
    const handlePlayback = async () => {
      try {
        if (isPlaying) {
          await audio.play();
        } else {
          audio.pause();
        }
        
      } catch (err) {
        console.error("Audio error:", err);
      }
    };
  
    handlePlayback();
  
    return () => {
      audio.pause();
    };
  }, [currentSong, isPlaying]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  // Song navigation
  const handleNext = () => {
    if (!songs.length || !currentSong) return;
  
    const currentIndex = songs.findIndex(song => song._id === currentSong._id);
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
    if (!songs.length || !currentSong) return;
  
    const currentIndex = songs.findIndex(song => song._id === currentSong._id);
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
  
  // Playback controls
  const togglePlayPause = () => {
    togglePlay();
  };  

  // Time formatting
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Drawer controls
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (event.type === 'keydown' && ['Tab', 'Shift'].includes((event as React.KeyboardEvent).key)) {
      return;
    }
    setOpen(open);
  };

  if (!songs.length) {
    return (
      <div className="fixed bottom-0 left-0 z-[1300] h-17 w-full shadow-lg bg-[#212121] px-4 flex items-center justify-center text-white">
        <p>No songs available</p>
      </div>
    );
  }

  if (!currentSong) return null;


  return (
    <div className="fixed bottom-0 left-0 z-[1000] h-17 w-full shadow-lg bg-[#212121] px-4">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gray-500 cursor-pointer">
        <div 
          className="h-full bg-white transition-all duration-300" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mini player */}
      <div className="flex items-center h-full">
        <button 
          className="w-[70%] text-left"
          onClick={toggleDrawer(true)}
          aria-label="Open player"
        >
          <div className="flex gap-4 items-center">
            <img
              className="w-12 h-12 rounded-lg"
              src={currentSong.thumbnail}
              alt={currentSong.title}
            />
            <div>
              <h1 className="text-sm font-semibold">{currentSong.title}</h1>
              <p className="text-xs text-gray-400">
                {currentSong.artist.firstName} {currentSong.artist.lastName}
              </p>
            </div>
          </div>
        </button>

        <div className="flex justify-between px-3 w-[30%]">
          <button onClick={togglePlayPause}>
            {isPlaying ? <IoMdPause size={30} color="white" /> : <IoMdPlay size={30} color="white" />}
          </button>
          <button onClick={handleNext}>
            <MdSkipNext size={30} color="white" />
          </button>
        </div>
      </div>

      {/* Full-screen drawer */}
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        sx={{
          zIndex: 2000, 
          '& .MuiDrawer-paper': {
            zIndex: 2000 
          }
        }}
        PaperProps={{ 
          sx: { 
            height: "100vh", 
            borderRadius: "12px 12px 0 0",
            background: "linear-gradient(to bottom, #271d16, #000)",
            backdropFilter: "blur(15px)",
            zIndex:"2000"
          } 
        }}
      >
        <Box p={3} height="100%" display="flex" flexDirection="column">
          {/* Header */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <button onClick={toggleDrawer(false)}>
              <FaAngleDown color="white" size={24} />
            </button>
            <button>
              <BsThreeDotsVertical color="white" size={22} />
            </button>
          </Box>

          {/* Artwork */}
          <Box flex={1} display="flex" flexDirection="column" alignItems="center">
            <img
              className="rounded-lg w-[300px] h-[300px] object-cover mx-auto"
              src={currentSong.thumbnail}
              alt={currentSong.title}
            />

            {/* Song info */}
            <Box mt={4} textAlign="center">
              <Typography sx={{ fontSize: "1.8rem", fontWeight: "bold", color: "white" }}>
                {currentSong.title}
              </Typography>
              <Typography sx={{ fontSize: "1rem", color: "gray" }}>
                {currentSong.artist.firstName} {currentSong.artist.lastName}
              </Typography>
            </Box>

            {/* Progress bar */}
            <Box width="100%" mt={4} px={2}>
            <input
  type="range"
  min="0"
  max="100"
  value={progress}
  onChange={(e) => {
    if (audioRef.current) {
      const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  }}
  className="w-full h-[4px] rounded-lg appearance-none cursor-pointer 
            bg-gradient-to-r from-white to-gray-600
            [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-white"
/>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography sx={{ color: "gray", fontSize: "0.8rem" }}>
                  {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
                </Typography>
                <Typography sx={{ color: "gray", fontSize: "0.8rem" }}>
                  {audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}
                </Typography>
              </Box>
            </Box>

            {/* Controls */}
            <Box mt={6} display="flex" gap={4} alignItems="center">
              <button 
                onClick={() => setIsRepeating(!isRepeating)} 
                style={{ color: isRepeating ? "#1976d2" : "white" }}
              >
                <FiRepeat size={25} />
              </button>

              <button onClick={handlePrev}>
                <MdSkipPrevious size={40} color="white" />
              </button>

              <button
                className="bg-white p-3 rounded-full"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <IoMdPause size={50} color="black" />
                ) : (
                  <IoMdPlay size={50} color="black" />
                )}
              </button>

              <button onClick={handleNext}>
                <MdSkipNext size={40} color="white" />
              </button>

              <button 
                onClick={() => setIsShuffling(!isShuffling)} 
                style={{ color: isShuffling ? "#1976d2" : "white" }}
              >
                <ImShuffle size={25} />
              </button>
            </Box>
          </Box>
        </Box>
      </SwipeableDrawer>

      {/* Hidden audio element */}
      <audio
  ref={audioRef}
  onEnded={handleNext}
/>

    </div>
  );
};

export default MobileMusicPlayer;