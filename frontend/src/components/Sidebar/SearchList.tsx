import React, { useState } from 'react'
import { IoPlay } from 'react-icons/io5';
import { useSongs } from '../../store/SongContext';

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
  }
const SearchList: React.FC<ArtistMusicCardProps>  = ({song}) => {
    const [hover, setHover] = useState(false);
    const { playSong } = useSongs();
    
    const formatDuration = (seconds : number): string => {
      if (isNaN(seconds)) return "0:00";
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
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
              alt="Song Thumbnail"
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
              <h1 onClick={() => playSong(song)} className="text-sm cursor-pointer text-white font-semibold">{song.title}</h1>
              <h2 className="text-xs text-gray-400">
                {song.artist.firstName + " " + song.artist.lastName}
              </h2>
            </div>
          </div>
          <div>
            <h1 className='text-white'>{formatDuration(song.duration ?? 0)}</h1>
          </div>
        </div>
  )
}

export default SearchList