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

export default function Banks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchBanks();
  }, []);

    const fetchBanks = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/api/banks');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBanks(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    return (
        <Box maxW="6xl" mx="auto" px={4} py={8}>
        <Heading as="h3" size="lg" textAlign="start" mb={6}>
            Bank List
        </Heading>

        {loading && (
            <Spinner size="xl" color="blue.500" />
        )}

        {error && (
            <Text color="red.500" textAlign="center">
                Error: {error}
            </Text>
        )}

        {banks.length > 0 ? (
            <Table.Root>
                <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Name</Table.ColumnHeader>
                    <Table.ColumnHeader>Logo</Table.ColumnHeader>
                    <Table.ColumnHeader>Color</Table.ColumnHeader>
                    <Table.ColumnHeader>Actions</Table.ColumnHeader>
            </Table.Row>
                </Table.Header>
                <Table.Body>
                {banks.map((item) => (
                    <Table.Row key={item.id}>
                    <Table.Cell>{item.bank_name}</Table.Cell>
                    <Table.Cell>{item.image}</Table.Cell>
                    <Table.Cell>{item.color}</Table.Cell>
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
                No banks found.
            </Text>
        )}
        </Box>
  );
}
