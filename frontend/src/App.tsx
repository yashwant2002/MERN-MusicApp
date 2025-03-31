import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar/Sidebar";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Explore from "./pages/Explore";
import MyMusic from "./pages/MyMusic";
import MusicPlayer from "./components/Music/MusicPlayer";
import MoblieMusicPlayer from "./components/Music/MoblieMusicPlayer";
import ErrorBoundary from "./utils/ErroBoundry";
import { useSongs } from "./store/SongContext";
import Login from "./components/Auth/Login";
import AuthDialog from "./components/Auth/AuthDialog";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  interface Song {
    title: string;
    artist: string;
    thumbnail: string;
    track: string;
    likes : string;
  }

  const {songs} = useSongs()
// const songs : Song = [
//   {
//     title: "Superstar",
//     artist: "Freddie Dredd",
//     thumbnail:
//       "https://res.cloudinary.com/dxgq4qa2t/image/upload/v1742948256/thumbnails/e5dqf7ha4lshog5cmell.jpg",
//     track:
//       "https://res.cloudinary.com/dxgq4qa2t/video/upload/v1742948254/tracks/kxaopiz6bs4xxsk5wcsk.mp3",
//     likes: "100",
//   },
//   { 
//     title: "Next Song",
//     artist: "Artist 2",
//     thumbnail: "/cover2.jpg",
//     track: "/audio/nextsong.mp3",
//     likes: 0,
//   },
// ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white">
      <Box sx={{ display: "flex",overflow:"hidden", zIndex: 1000 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            minWidth : "0",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "center",
            padding : isMobile ?"1rem": ".8rem",
            marginTop: isMobile ? "4rem" : "4rem",
            marginLeft: isMobile ? ".1rem" : "2rem",
            marginRight: isMobile ? ".1rem" : "2rem", 
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/login" element={<AuthDialog />} /> */}
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<MyMusic />} />
          </Routes>
        </Box>
      </Box>
      <ErrorBoundary>

      {
        isMobile ? <MoblieMusicPlayer songs={songs}/> : <MusicPlayer />
      }
      </ErrorBoundary>
    </div>
  );
}


export default App;
