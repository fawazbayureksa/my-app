import React from 'react'
import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Spinner,
  Table,
  Text,
  Button
} from "@chakra-ui/react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
    <Box maxW="6xl" mx="auto" px={4} py={8}>
      <Heading as="h3" size="lg" textAlign="start" mb={6}>
        User List
      </Heading>

      {loading && (
          <Spinner size="xl" color="blue.500" />
      )}

      {error && (
          <Text color="red.500" textAlign="center">
            Error: {error}
          </Text>
      )}

      {users.length > 0 ? (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                 <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
           </Table.Row>
            </Table.Header>
            <Table.Body>
              {users.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      size="sm"
                      mr={2}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="link"
                      colorScheme="red"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
        </Table.Root>
      ) : (
          <Text textAlign="center" fontSize="lg" color="gray.500">
            No users found.
          </Text>
      )}
    </Box>
  );


}
