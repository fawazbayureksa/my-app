import React from 'react';
import { Box, VStack, Flex, Heading, Text, Button } from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';
import { FiTag, FiPlus } from 'react-icons/fi';

export default function CategoryEmptyState({ onOpenModal }) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const iconBg = useColorModeValue('blue.50', 'blue.950/50');

  return (
    <Box
      bg={cardBg}
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
      p={12}
      textAlign="center"
      shadow="xs"
    >
      <VStack gap={3}>
        <Flex w={12} h={12} align="center" justify="center" borderRadius="2xl" bg={iconBg}>
          <FiTag size={24} color="var(--chakra-colors-blue-500)" />
        </Flex>
        <Heading size="sm" fontWeight="700">No Categories Found</Heading>
        <Text fontSize="xs" color={subtitleColor} maxW="sm">
          Get started by creating your first category to organize transaction records.
        </Text>
        <Button
          onClick={onOpenModal}
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.600" }}
          size="sm"
          borderRadius="xl"
          mt={2}
          fontWeight="600"
        >
          <FiPlus style={{ marginRight: '6px' }} />
          Create First Category
        </Button>
      </VStack>
    </Box>
  );
}
