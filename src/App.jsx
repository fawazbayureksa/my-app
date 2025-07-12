import { Box, ChakraProvider} from '@chakra-ui/react'
import Sidebar from './components/layout/sidebar'
import { Routes, Route } from 'react-router-dom'

import Dashboard from './pages/dashboard/Dashboard'
import Users from './pages/users/Users'
import Settings from './pages/settings/Settings'
import Banks from './pages/banks/Banks'
import Register from './pages/users/Register'
import Login from './pages/users/Login'
import { useEffect, useState } from 'react'
import Category from './pages/category/Category'
import { Toaster } from './components/ui/toaster'
function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token) {
      setToken(token);
      setUser(user);
    }
  }, []);


  return (
    <div>
      {!token && (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        )}
      {token && (
        <>
          <Sidebar />
          <Box>
            <Box ml="250px" p="6"> 
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/banks" element={<Banks />} />
                  <Route path="/categories" element={<Category />} />
              </Routes>
            </Box>
        </Box>
         <Toaster />
        </>
      )}
    </div>
  )
}

export default App
