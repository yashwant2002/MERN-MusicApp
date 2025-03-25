import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar/Sidebar";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Explore from "./pages/Explore";
import Libray from "./pages/Libray";

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white">
      <Box sx={{ display: "flex",overflow:"hidden" }}>
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
            justifyContent: "center",
            padding : isMobile ?"1rem": ".8rem",
            marginTop: isMobile ? "4rem" : "4rem",
            marginLeft: isMobile ? ".1rem" : "2rem",
            marginRight: isMobile ? ".1rem" : "2rem", 
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/library" element={<Libray />} />
          </Routes>
        </Box>
      </Box>
    </div>
  );
}


export default App;
