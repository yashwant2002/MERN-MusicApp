import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Sidebar from './components/Sidebar/Sidebar'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import Explore from './pages/Explore'
import Libray from './pages/Libray'

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-950 to-black min-h-screen text-white">
    <Box sx={{ display: "flex" }}>
    <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, height: "100vh", marginTop:isMobile?"4rem":"4rem", marginLeft:isMobile?".2rem":"2rem"  }}>
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/explore" element={<Explore/>} />
        <Route path="/library" element={<Libray/>} />
      </Routes>
      </Box>
    </Box>

      
    </div>
  )
}

export default App
