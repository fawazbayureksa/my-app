import { Box, Heading } from '@chakra-ui/react';
import React,{ useEffect, useState } from 'react';

const Dashboard = () => {
  const [name, setName] = useState('');

  useEffect(() => {
    if(localStorage.getItem('user') != null) {
      const user = JSON.parse(localStorage.getItem('user'));
      setName(user.name);
    }else {
      history.push('/login');
    }
  }, []);

  return (
    <Box>
      <Heading>Dashboard</Heading>
      <p>Welcome to the dashboard {name}</p>
    </Box>
  );
};

export default Dashboard;