import React, { useState} from "react";
import { CiHeart } from "react-icons/ci";
import { IoPlay } from "react-icons/io5";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { usePlaylist } from "../../store/PlaylistContext";
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
  duration?: number;
}

interface PlaylistMusicCardProps {
  playlistId: string;
  song: Song;
}

const PlaylistMusicCard: React.FC<PlaylistMusicCardProps> = ({
  playlistId,
  song,
}) => {
  const [hover, setHover] = useState(false);
  const { removeSongFromPlaylist } = usePlaylist();
  const { playSong } = useSongs();

  const handleDeleteSong = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeSongFromPlaylist(playlistId, song._id);
    } catch (error) {
      console.error("Error removing song:", error);
    }
  };

  const formatDuration = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="flex items-center justify-between pr-10 relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Song Info */}
      <div className="flex items-center gap-3">
        <div className="relative rounded-lg m-2">
          <img
            src={song.thumbnail}
            className="w-12 h-12 rounded-lg"
            alt="Song Thumbnail"
          />
          <div
            className={`absolute inset-0 bg-black/40 flex justify-center items-center transition-opacity duration-200 ${
              hover ? "opacity-100 cursor-pointer" : "opacity-0"
            }`}
          >
            <button onClick={() => playSong(song)}>
              {" "}
              <IoPlay />
            </button>
          </div>
        </div>
        <div>
          <h1 onClick={() => playSong(song)} className="text-sm cursor-pointer font-semibold">{song.title}</h1>
          <h2 className="text-xs text-gray-400">
            {song.artist.firstName} {song.artist.lastName}
          </h2>
        </div>
      </div>

      <div>
        {hover ? (
          <div className="flex items-center justify-between w-30 lg:w-50">
            <button>
              <CiHeart size={25} />
            </button>
            <button className="cursor-pointer" onClick={handleDeleteSong}>
              <RxCross2 size={25} />
            </button>
            <button>
              <MdCheckBoxOutlineBlank size={25} />
            </button>
          </div>
        ) : (
          <p>{formatDuration(song.duration ?? 0)}</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistMusicCard;
