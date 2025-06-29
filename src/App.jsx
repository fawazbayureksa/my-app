import { Box } from '@chakra-ui/react'
import Sidebar from './components/layout/sidebar'
import { Routes, Route } from 'react-router-dom'

import Dashboard from './pages/dashboard/Dashboard'
import Users from './pages/users/Users'
import Settings from './pages/settings/Settings'
function App() {
  return (
    <div>
      <Sidebar />
      <Box>
        <Box ml="250px" p="6"> {/* Geser konten utama */}
          <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        </Box>
      </Box>
    </div>
  )
}

export default App
