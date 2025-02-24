import { PlayArrow } from "@mui/icons-material";

const HomeSongCard = () => {
  return (
    <div className="w-[160px] lg:w-[180px] ">
      <div className="relative w-full h-[160px] lg:h-[180px] inline-block rounded-lg overflow-hidden cursor-pointer m-2">
        <img 
          src="https://images.pexels.com/photos/29065466/pexels-photo-29065466/free-photo-of-hand-using-laptop-next-to-dslr-camera.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex justify-center items-center">
          <button className="text-white rounded-full bg-black p-2 hover:bg-gray-900 cursor-pointer">
            <PlayArrow fontSize="large" />
          </button>
        </div>
      </div>
      <div className="w-full text-white mt-2">
        <a className="font-bold block truncate whitespace-nowrap overflow-hidden">
          Chhaava (Original Motion Picture Soundtrack)
        </a>
        <p className="text-sm truncate whitespace-nowrap overflow-hidden">
          Album: <span className="text-gray-300">Artist Name</span>
        </p>
      </div>
    </div>
  );
};

export default HomeSongCard;
