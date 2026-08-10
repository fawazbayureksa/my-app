import React from 'react';
import {
  Dialog,
  Portal,
  CloseButton,
  VStack,
  Field,
  Input,
  HStack,
  Button
} from '@chakra-ui/react';
import { useColorModeValue } from '../ui/color-mode';

export default function CategoryModal({
  open,
  onOpenChange,
  categoryName,
  setCategoryName,
  description,
  setDescription,
  onAddCategory,
  loading
}) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={onOpenChange}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            borderRadius="2xl"
            bg={cardBg}
            maxW="md"
            p={6}
            shadow="xl"
          >
            <Dialog.Header pb={4} borderBottom="1px solid" borderColor={borderColor}>
              <Dialog.Title fontSize="lg" fontWeight="800" letterSpacing="tight">
                Create New Category
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body py={5}>
              <VStack gap={4}>
                <Field.Root required w="full">
                  <Field.Label fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color={subtitleColor} mb={1.5}>
                    Category Name <Field.RequiredIndicator />
                  </Field.Label>
                  <Input
                    placeholder="e.g., Food & Dining, Travel, Utilities"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    borderRadius="xl"
                    size="md"
                  />
                </Field.Root>

                <Field.Root w="full">
                  <Field.Label fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color={subtitleColor} mb={1.5}>
                    Description
                  </Field.Label>
                  <Input
                    placeholder="Brief description of this category"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    borderRadius="xl"
                    size="md"
                  />
                </Field.Root>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer pt={4} borderTop="1px solid" borderColor={borderColor}>
              <HStack justify="flex-end" gap={3} w="full">
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline" borderRadius="xl" size="sm">
                    Cancel
                  </Button>
                </Dialog.ActionTrigger>
                <Button
                  onClick={onAddCategory}
                  loading={loading}
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: "blue.600" }}
                  borderRadius="xl"
                  size="sm"
                  fontWeight="600"
                >
                  Create Category
                </Button>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" position="absolute" top={4} right={4} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
