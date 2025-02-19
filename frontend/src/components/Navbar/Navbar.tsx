import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

const Navbar = () => {
  return (
    <div className=" text-white items-center h-16 flex bg-[#030303]">
      <div className="w-[15rem] pl-3.5 font-bold text-2xl flex items-center space-x-4">
        <button type="button">
          <MenuIcon />
        </button>
        <span>LOGO</span>
      </div>
      <div className="w-full flex justify-between">
        <div className=" ml-16 relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search songs, albums, artists, podcasts"
            className="w-full h-10 p-3 pl-12 text-white bg-white/10 border border-white/20 rounded-lg shadow-lg outline-none-blue-400 backdrop-blur-md placeholder-white/70"
          />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white opacity-70 w-5 h-5" />
        </div>
        <div className="mr-3">
          <button className="px-6 py-3 h-10 flex items-center text-white font-semibold bg-white/10 border border-white/20 rounded-full shadow-lg backdrop-blur-md hover:bg-white/20 transition-all duration-300">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
