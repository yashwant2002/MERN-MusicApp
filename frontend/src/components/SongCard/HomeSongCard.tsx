import { PlayArrow } from "@mui/icons-material";
import { useSongs } from "../../store/SongContext";

interface SongProps {
  song: {
    _id: string;
    title: string;
    artist: {
      _id: string;
    firstName: string;
    lastName: string;
    };
    firstName: string;
    thumbnail: string;
    track: string;
  };
}

const HomeSongCard: React.FC<SongProps> = ({ song }) => {
  const { playSong } = useSongs();

  return (
    <div className="w-[160px] lg:w-[180px]">
      <div
        className="relative w-full h-[160px] lg:h-[180px] inline-block rounded-lg overflow-hidden cursor-pointer m-2"
        onClick={() => playSong(song)} 
      >
        <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex justify-center items-center">
          <button className="text-white rounded-full bg-black p-2 hover:bg-gray-900 cursor-pointer">
            <PlayArrow fontSize="large" />
          </button>
        </div>
      </div>
      <div className="w-full text-white mt-2">
        <a className="font-bold block truncate">{song.title}</a>
        <p className="text-sm truncate">
          Artist: <span className="text-gray-300">{song.artist.firstName + " " + song.artist.lastName}</span>
        </p>
      </div>
    </div>
  );
};

export default HomeSongCard;
