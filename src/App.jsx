import { Box } from '@chakra-ui/react'
import Sidebar from './components/layout/sidebar'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Dashboard from './pages/dashboard/Dashboard'
import Users from './pages/users/Users'
import Settings from './pages/settings/Settings'
import Banks from './pages/banks/Banks'
import Register from './pages/users/Register'
import Login from './pages/users/Login'
import { useEffect, useState } from 'react'
import Category from './pages/category/Category'
import { Toaster } from './components/ui/toaster'

function Layout() {
  return (
    <Box>
      <Sidebar />
      <Box ml="250px" p="6">
        <Toaster />
        <Outlet />
      </Box>
    </Box>
  )
}

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setToken(token);
      setUser(user);
    } else {
      setUser(null);
      setToken(null);
    }
  }, []);

  return (
    <Routes>
      {!token ? (
        <>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="banks" element={<Banks />} />
          <Route path="categories" element={<Category />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      )}
    </Routes>
  )
}

export default App