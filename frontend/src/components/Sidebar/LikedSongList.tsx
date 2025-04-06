import React, { useState } from "react";
import { useSongs } from "../../store/SongContext";
import { IoPlay } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import axiosInstance from "../../utils/axiosInstance";
import { IoMdHeart } from "react-icons/io";

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
  duration?: number;
}

interface ArtistMusicCardProps {
  song: Song;
  onDislike: (songId: string) => void; // new prop
}

const LikedSongList: React.FC<ArtistMusicCardProps> = ({ song, onDislike }) => {
  const [hover, setHover] = useState(false);
  const { playSong } = useSongs();

  const formatDuration = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDislike = async () => {
    try {
      await axiosInstance.post("/api/user/unlike", { songId: song._id });
      onDislike(song._id); // remove from UI
    } catch (error) {
      console.error("Error disliking song:", error);
    }
  };

  return (
    <div
      className="flex items-center h-full justify-between pr-10"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center gap-4">
        <div className="rounded-lg m-2 relative flex gap-5 items-center">
          <img
            src={song.thumbnail}
            className="w-12 h-12 rounded-lg"
            alt={song.title}
          />
          <div
            className={`absolute inset-0 bg-black/40 flex justify-center items-center transition-opacity duration-200 ${
              hover ? "opacity-100 cursor-pointer" : "opacity-0"
            }`}
          >
            <button onClick={() => playSong(song)}>
              <IoPlay />
            </button>
          </div>
        </div>
        <div>
          <h1 onClick={() => playSong(song)} className="text-sm cursor-pointer font-semibold">{song.title}</h1>
          <h2 className="text-xs text-gray-400">
            {song.artist.firstName + " " + song.artist.lastName}
          </h2>
        </div>
      </div>
      <div className="flex justify-between w-26">
        <button className="cursor-pointer" onClick={handleDislike}>
          <IoMdHeart size={25} className="text-red-500" />
        </button>
        <h1>{formatDuration(song.duration)}</h1>
      </div>
    </div>
  );
};

export default LikedSongList;
