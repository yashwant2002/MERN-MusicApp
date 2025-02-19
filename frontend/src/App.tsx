import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Sidebar from './components/Sidebar/Sidebar'

function App() {


  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-950 to-black min-h-screen text-white">
      <Sidebar />
      <Routes>
        {/* <Route path='/' element={<Home />} /> */}
      </Routes>
    </div>
  )
}

export default App
