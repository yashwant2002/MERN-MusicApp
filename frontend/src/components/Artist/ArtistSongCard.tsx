import React, { useState } from "react";
import { IoPlay } from "react-icons/io5";


const ArtistSongCard: React.FC = () => {
  const [hover, setHover] = useState(false);
  // const { playSong } = useSongs();

  return (
    <div
      className="flex items-center h-full justify-between pr-10"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center gap-4">
      <div className="rounded-lg m-2 relative flex gap-5 items-center">
        <img
          src="https://images.pexels.com/photos/30722562/pexels-photo-30722562/free-photo-of-woman-in-flowing-blue-dress-on-wooden-pier.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          className="w-12 h-12 rounded-lg"
          alt="Song Thumbnail"
        />
        <div
          className={`absolute inset-0 bg-black/40 flex justify-center items-center transition-opacity duration-200 ${
            hover ? "opacity-100 cursor-pointer" : "opacity-0"
          }`}
        >
          <button>
            <IoPlay />
          </button>
        </div>       
      </div>
      <div>
          <h1 className="text-sm cursor-pointer font-semibold">Song name</h1>
          <h2 className="text-xs text-gray-400">
            Artist Name
          </h2>
        </div>
      </div>
      <div>
        <h1>00:00</h1>
      </div>
    </div>
  );
};

export default ArtistSongCard;
