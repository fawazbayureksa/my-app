import React from 'react'
import { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Spinner,
  Table,
  Text,
  Button,
  useDisclosure,
  Dialog,
  Portal,
  CloseButton,
  Field,
  Input,
} from "@chakra-ui/react";
import Config from '../../components/axios/Config';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    fetchUsers();
  }, []);

    const fetchUsers = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
     
      const url = import.meta.env.VITE_API_URL + 'users';
      
      let axiosInstance = axios.get(url, Config({ Authorization: `Bearer ${token}` }))

      await axiosInstance.then(response => {
          setUsers(response.data.data);
        }).catch(error => {
          console.error(error);
          setError(error);
        }).finally(() => {
          setLoading(false);
        });
    };

    const deleteUser = async (id) => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        fetchUsers();
      } catch (error) {
        setError(error.message);
      }
    };

    const handleDelete = (id) => {
      if (window.confirm('Are you sure you want to delete this user?')) {
        deleteUser(id);
      }
    }

    const handleEdit = (id, data) => {
      setModal(true)
      setName(data.name)
      setEmail(data.email)

    }

    return (
      <>
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
                    {/* <Button
                      variant="link"
                      colorScheme="blue"
                      size="sm"
                      mr={2}
                      onClick={() => handleEdit(user.id, {name: user.name, email: user.email})}
                    >
                      Edit
                    </Button> */}
                    <Button
                      variant="link"
                      colorPalette="red"
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
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
  {/* {modal && ( */}
    <>
    <Dialog.Root lazyMount open={modal} onOpenChange={(e) => setModal(e.open)}>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Edit</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                    <Field.Root required marginBottom={'20px'}>
                        <Field.Label>
                            Name <Field.RequiredIndicator />
                        </Field.Label>
                        <Input placeholder="Enter your name" value={name}
                        onChange={(e) => setName(e.target.value)} />
                    </Field.Root>
                      <Field.Root required marginBottom={'20px'}>
                        <Field.Label>
                            Email <Field.RequiredIndicator />
                        </Field.Label>
                        <Input placeholder="Enter your email" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    </Field.Root>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button variant="outline" colorScheme="blue" type="submit">Save</Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
    </Dialog.Root>
    </>
  {/* )} */}
  </>
  );

}
