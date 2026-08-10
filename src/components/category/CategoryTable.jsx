import React from 'react';
import { Box, Table, HStack, Badge, Flex, Text, IconButton } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { FiFolder, FiTrash2 } from 'react-icons/fi';

export default function CategoryTable({ categories, onDelete }) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const tableHeaderBg = useColorModeValue('gray.50/80', 'gray.900/60');
  const tableRowHoverBg = useColorModeValue('gray.50/50', 'gray.900/40');
  const folderBg = useColorModeValue('blue.50', 'blue.950/50');

  return (
    <Box
      bg={cardBg}
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
      shadow="xs"
      overflow="hidden"
    >
      <Table.Root size="md" variant="subtle">
        <Table.Header>
          <Table.Row bg={tableHeaderBg} borderBottom="1px solid" borderColor={borderColor}>
            <Table.ColumnHeader py={4} fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color={subtitleColor}>
              Category
            </Table.ColumnHeader>
            <Table.ColumnHeader py={4} fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color={subtitleColor}>
              Description
            </Table.ColumnHeader>
            <Table.ColumnHeader py={4} fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color={subtitleColor} textAlign="end">
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {categories.map((item, index) => (
            <Table.Row
              key={item.ID}
              borderBottom={index !== categories.length - 1 ? "1px solid" : "none"}
              borderColor={borderColor}
              transition="background-color 0.2s"
              _hover={{ bg: tableRowHoverBg }}
            >
              <Table.Cell py={4}>
                <HStack gap={3}>
                  <Badge
                    size="sm"
                    variant="subtle"
                    colorPalette="blue"
                    borderRadius="lg"
                    px={2}
                    py={0.5}
                    fontWeight="700"
                  >
                    #{index + 1}
                  </Badge>
                  <Flex w={8} h={8} borderRadius="lg" bg={folderBg} align="center" justify="center">
                    <FiFolder size={16} color="var(--chakra-colors-blue-500)" />
                  </Flex>
                  <Text fontWeight="700" fontSize="sm">
                    {item.CategoryName}
                  </Text>
                </HStack>
              </Table.Cell>
              <Table.Cell py={4}>
                <Text fontSize="sm" color={item.Description ? 'inherit' : subtitleColor}>
                  {item.Description || 'No description provided'}
                </Text>
              </Table.Cell>
              <Table.Cell py={4} textAlign="end">
                <HStack gap={2} justify="flex-end">
                  <IconButton
                    variant="ghost"
                    colorPalette="red"
                    size="sm"
                    onClick={() => onDelete(item.ID)}
                    aria-label="Delete category"
                    borderRadius="lg"
                  >
                    <FiTrash2 />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
