import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar/Sidebar";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Explore from "./pages/Explore";
import MyMusic from "./pages/MyMusic";
import MusicPlayer from "./components/Music/MusicPlayer";
import MoblieMusicPlayer from "./components/Music/MoblieMusicPlayer";
import ErrorBoundary from "./utils/ErroBoundry";
import Playlist from "./components/Playlist/Playlist";
import Artist from "./components/Artist/Artist";
import MobileSidebar from "./components/Sidebar/MobileSidebar";
import LikedPlaylist from "./components/Sidebar/LikedPlaylist";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
const isPlaylistRoute = location.pathname === "/playlist";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white">
      <Box sx={{ display: "flex",overflow:"hidden", zIndex: 1000 }}>
        {isMobile?<MobileSidebar/>:<Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            padding:isPlaylistRoute? "0" : isMobile ? "1rem" : ".8rem",
            marginTop:isPlaylistRoute? "0" : isMobile ? "4rem" : "4rem",
            marginLeft:isPlaylistRoute? "0" : isMobile ? ".1rem" : "2rem",
            marginRight:isPlaylistRoute? "0" : isMobile ? ".1rem" : "2rem",
            marginBottom:isPlaylistRoute? "0" : isMobile ? "5rem" : "2rem",
            overflowY: "auto",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<MyMusic />} />
            <Route path="/playlist/:id" element={<Playlist/>} />
            <Route path="/artist/:artistId" element={<Artist/>}/>
            <Route path="/likedSong" element={<LikedPlaylist/>}/>
          </Routes>
        </Box>
      </Box>
      <ErrorBoundary>

      {
        isMobile ? <MoblieMusicPlayer /> : <MusicPlayer />
      }
      </ErrorBoundary>
    </div>
  );
}


export default App;
