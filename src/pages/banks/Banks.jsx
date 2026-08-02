import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Heading,
  Spinner,
  Text,
  Button,
  Dialog,
  Portal,
  CloseButton,
  Field,
  Input,
  Flex,
  Stack,
  Badge,
  SimpleGrid,
  VStack,
  HStack,
  Spacer,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { toaster } from "./../../components/ui/toaster"
import { useColorModeValue } from '../../components/ui/color-mode';
import { FiPlus, FiSearch, FiTrash2, FiCreditCard, FiFilter, FiRefreshCw } from 'react-icons/fi';

export default function Banks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState(null);
  const [bankName, setBankName] = useState('');
  const [logo, setLogo] = useState('');
  const [color, setColor] = useState('');
  
  // Pagination, Search, Filter, Sort states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterBankName, setFilterBankName] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  const fetchBanks = useCallback(async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
      });
      
      if (search) params.append('search', search);
      if (filterBankName) params.append('bank_name', filterBankName);
      if (filterColor) params.append('color', filterColor);
      if (sortBy) {
        params.append('sort_by', sortBy);
        params.append('sort_dir', sortDir);
      }
      let url = import.meta.env.VITE_API_URL + 'banks';
      const response = await fetch(`${url}?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setBanks(result.data.data || []);
      setTotalPages(result.data.total_pages || 1);
      setTotalItems(result.data.total_items || 0);
    } catch (error) {
      setError(error.message);
      toaster.create({
        description: "Failed to fetch banks",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, filterBankName, filterColor, sortBy, sortDir]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const handleAddBank = async () => {
    try {
      let body = {
        bank_name: bankName,
        image: logo,
        color: color,
      }

      const response = await fetch(import.meta.env.VITE_API_URL + 'banks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      toaster.create({
        description: "Bank successfully created",
        type: "success",
      })
      setBanks([...banks, data.data]);
      setModal(false);
      setBankName('');
      setLogo('');
      setColor('');
    } catch (error) {
      toaster.create({
        description: "Failed to create bank",
        type: "error",
      })
      setError(error.message);
    }
  }

  const deleteBank = async (id) => {
    try {
      let url = import.meta.env.VITE_API_URL + 'banks';
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      toaster.create({
        description: "Bank successfully deleted",
        type: "success",
      })
      fetchBanks();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bank?')) {
      deleteBank(id);
    }
  }

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSearchInput('');
    setFilterBankName('');
    setFilterColor('');
    setSortBy('');
    setSortDir('asc');
    setPage(1);
  };

  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box minH="100vh" bg={pageBg}>
      <Box maxW="7xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }} py={8}>
        {/* Hero Header */}
        <Flex
          justify="space-between"
          align={{ base: 'flex-start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
          gap={4}
          mb={8}
          pb={6}
          borderBottom="1px solid"
          borderColor={borderColor}
        >
          <Box>
            <Flex align="center" gap={2} mb={2}>
              <Box w={2} h={2} borderRadius="full" bg="blue.500" />
              <Text fontSize="xs" fontWeight="600" textTransform="uppercase" letterSpacing="widest" color={subtitleColor}>
                Account Infrastructure
              </Text>
            </Flex>
            <Heading as="h5" size={{ base: 'xl', md: '2xl' }} fontWeight="800" letterSpacing="tight" mb={1.5}>
              Bank Portfolio
            </Heading>
            <Text color={subtitleColor} fontSize="md">
              Manage your connected banking institutions and asset source accounts.
            </Text>
          </Box>

          <Button
            onClick={() => setModal(true)}
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            size="md"
            borderRadius="xl"
            px={5}
            fontWeight="600"
            boxShadow="xs"
          >
            <FiPlus style={{ marginRight: '6px' }} />
            Add New Bank
          </Button>
        </Flex>

        {/* Search & Filter Toolbar */}
        <Box
          bg={cardBg}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          p={5}
          shadow="xs"
          mb={8}
        >
          <VStack gap={4} align="stretch">
            {/* Top Search Bar */}
            <Flex gap={3} wrap="wrap">
              <Input
                placeholder="Search banks by name or color code..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                flex={1}
                minW="240px"
                bg={useColorModeValue('gray.50', 'gray.900')}
                borderColor={borderColor}
                borderRadius="xl"
                size="md"
              />
              <Button
                onClick={handleSearch}
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                borderRadius="xl"
                px={5}
                fontWeight="600"
              >
                <FiSearch style={{ marginRight: '6px' }} />
                Search
              </Button>
              <Button variant="outline" onClick={handleClearFilters} borderRadius="xl" px={4}>
                Clear
              </Button>
            </Flex>

            {/* Filter Inputs & Controls */}
            <Flex gap={4} align="center" wrap="wrap" justify="space-between">
              <HStack gap={3} wrap="wrap" flex={1}>
                <Flex align="center" gap={2}>
                  <Text fontSize="xs" fontWeight="600" color={subtitleColor}>Name</Text>
                  <Input
                    placeholder="Filter by name..."
                    value={filterBankName}
                    onChange={(e) => {
                      setFilterBankName(e.target.value);
                      setPage(1);
                    }}
                    w="170px"
                    size="sm"
                    bg={useColorModeValue('gray.50', 'gray.900')}
                    borderColor={borderColor}
                    borderRadius="lg"
                  />
                </Flex>

                <Flex align="center" gap={2}>
                  <Text fontSize="xs" fontWeight="600" color={subtitleColor}>Color</Text>
                  <Input
                    placeholder="Hex code..."
                    value={filterColor}
                    onChange={(e) => {
                      setFilterColor(e.target.value);
                      setPage(1);
                    }}
                    w="130px"
                    size="sm"
                    bg={useColorModeValue('gray.50', 'gray.900')}
                    borderColor={borderColor}
                    borderRadius="lg"
                  />
                </Flex>
              </HStack>

              <HStack gap={2}>
                <Text fontSize="xs" fontWeight="600" color={subtitleColor}>Show</Text>
                <Box
                  bg={useColorModeValue('gray.50', 'gray.900')}
                  px={2}
                  py={1}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </Box>
              </HStack>
            </Flex>

            {/* Active Filters Badges */}
            {(search || filterBankName || filterColor || sortBy) && (
              <Flex align="center" gap={2} wrap="wrap" pt={2} borderTop="1px solid" borderColor={borderColor}>
                <Text fontSize="xs" fontWeight="700" color={subtitleColor}>Active filters:</Text>
                {search && (
                  <Badge colorPalette="blue" variant="subtle" size="sm" borderRadius="full">
                    Search: {search}
                  </Badge>
                )}
                {filterBankName && (
                  <Badge colorPalette="green" variant="subtle" size="sm" borderRadius="full">
                    Name: {filterBankName}
                  </Badge>
                )}
                {filterColor && (
                  <Badge colorPalette="purple" variant="subtle" size="sm" borderRadius="full">
                    Color: {filterColor}
                  </Badge>
                )}
              </Flex>
            )}
          </VStack>
        </Box>

        {/* Loading State */}
        {loading && (
          <Flex justify="center" align="center" py={16}>
            <VStack gap={3}>
              <Spinner size="xl" color="blue.500" />
              <Text color={subtitleColor} fontSize="sm">Loading bank portfolio...</Text>
            </VStack>
          </Flex>
        )}

        {/* Error Alert */}
        {error && !loading && (
          <Box p={4} borderRadius="2xl" bg="red.50" border="1px solid" borderColor="red.200" mb={6}>
            <Text color="red.600" fontSize="sm" textAlign="center">
              Error fetching banks: {error}
            </Text>
          </Box>
        )}

        {/* Bank Grid */}
        {!loading && banks.length > 0 ? (
          <>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6} mb={8}>
              {banks.map((item) => (
                <Box
                  key={item.id}
                  bg={cardBg}
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor={borderColor}
                  shadow="xs"
                  overflow="hidden"
                  transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                  _hover={{ shadow: 'sm', transform: 'translateY(-2px)' }}
                >
                  {/* Top Brand Color Strip */}
                  <Box
                    h="6px"
                    bg={item.color || 'blue.500'}
                  />
                  
                  <Box p={6}>
                    <Flex justify="space-between" align="flex-start" mb={4}>
                      <Flex align="center" gap={3}>
                        {item.image ? (
                          <Flex
                            w={10}
                            h={10}
                            borderRadius="xl"
                            bg={useColorModeValue('gray.50', 'gray.900')}
                            align="center"
                            justify="center"
                            border="1px solid"
                            borderColor={borderColor}
                            overflow="hidden"
                          >
                            <Image
                              src={item.image}
                              alt={item.bank_name}
                              maxH="24px"
                              maxW="24px"
                              objectFit="contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                              }}
                            />
                          </Flex>
                        ) : (
                          <Flex
                            w={10}
                            h={10}
                            borderRadius="xl"
                            bg={useColorModeValue('blue.50', 'blue.950/50')}
                            align="center"
                            justify="center"
                          >
                            <FiCreditCard color="var(--chakra-colors-blue-500)" size={20} />
                          </Flex>
                        )}
                        <Box>
                          <Heading as="h3" size="sm" fontWeight="700" letterSpacing="tight">
                            {item.bank_name}
                          </Heading>
                          <Text fontSize="xs" color={subtitleColor} mt={0.5}>
                            Bank Account
                          </Text>
                        </Box>
                      </Flex>

                      {/* Brand Color Swatch */}
                      <Flex align="center" gap={1.5} px={2.5} py={1} borderRadius="lg" bg={useColorModeValue('gray.50', 'gray.900')} border="1px solid" borderColor={borderColor}>
                        <Box
                          w="10px"
                          h="10px"
                          borderRadius="full"
                          bg={item.color || 'gray.400'}
                        />
                        <Text fontSize="xs" fontFamily="mono" fontWeight="600" color={subtitleColor}>
                          {item.color || '#---'}
                        </Text>
                      </Flex>
                    </Flex>

                    <Flex justify="space-between" align="center" pt={4} borderTop="1px solid" borderColor={borderColor}>
                      <Text fontSize="xs" color={subtitleColor}>
                        ID: #{item.id}
                      </Text>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorPalette="red"
                        onClick={() => handleDelete(item.id)}
                        borderRadius="lg"
                      >
                        <FiTrash2 style={{ marginRight: '4px' }} />
                        Delete
                      </Button>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>

            {/* Pagination Controls */}
            <Box
              bg={cardBg}
              borderRadius="2xl"
              border="1px solid"
              borderColor={borderColor}
              p={4}
              shadow="xs"
            >
              <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                <Text fontSize="xs" color={subtitleColor}>
                  Showing <Text as="span" fontWeight="700">{((page - 1) * pageSize) + 1}</Text> to <Text as="span" fontWeight="700">{Math.min(page * pageSize, totalItems)}</Text> of <Text as="span" fontWeight="700">{totalItems}</Text> banks
                </Text>

                <HStack gap={1.5}>
                  <Button
                    size="xs"
                    onClick={() => setPage(1)}
                    isDisabled={page === 1}
                    variant="outline"
                    borderRadius="lg"
                  >
                    First
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => setPage(page - 1)}
                    isDisabled={page === 1}
                    variant="outline"
                    borderRadius="lg"
                  >
                    Prev
                  </Button>

                  {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = idx + 1;
                    else if (page <= 3) pageNum = idx + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + idx;
                    else pageNum = page - 2 + idx;

                    return (
                      <Button
                        key={pageNum}
                        size="xs"
                        bg="blue.500"
                        w="7"
                        h="7"
                        onClick={() => setPage(pageNum)}
                        colorPalette={page === pageNum ? 'blue' : 'gray'}
                        variant={page === pageNum ? 'solid' : 'ghost'}
                        borderRadius="lg"
                        fontWeight={page === pageNum ? '700' : '500'}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    size="xs"
                    onClick={() => setPage(page + 1)}
                    isDisabled={page === totalPages}
                    variant="outline"
                    borderRadius="lg"
                  >
                    Next
                  </Button>
                  <Button
                    size="xs"
                    onClick={() => setPage(totalPages)}
                    isDisabled={page === totalPages}
                    variant="outline"
                    borderRadius="lg"
                  >
                    Last
                  </Button>
                </HStack>
              </Flex>
            </Box>
          </>
        ) : !loading && (
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
              <Flex w={12} h={12} align="center" justify="center" borderRadius="2xl" bg={useColorModeValue('blue.50', 'blue.950/50')}>
                <FiCreditCard size={24} color="var(--chakra-colors-blue-500)" />
              </Flex>
              <Heading size="sm" fontWeight="700">No Banks Found</Heading>
              <Text fontSize="xs" color={subtitleColor} maxW="sm">
                No bank accounts match your current filter parameters. Try clearing filters or create a new bank.
              </Text>
              <Button onClick={() => setModal(true)} colorPalette="blue" size="sm" borderRadius="xl" mt={2}>
                <FiPlus style={{ marginRight: '6px' }} />
                Add Bank Account
              </Button>
            </VStack>
          </Box>
        )}

        {/* Add Bank Dialog Modal */}
        <Dialog.Root lazyMount open={modal} onOpenChange={(e) => setModal(e.open)}>
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
                    Add New Bank Account
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body py={5}>
                  <VStack gap={4}>
                    <Field.Root required w="full">
                      <Field.Label fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color={subtitleColor} mb={1.5}>
                        Bank Name <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        placeholder="e.g. Bank Central Asia, Mandiri, Jenius"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        borderRadius="xl"
                        size="md"
                      />
                    </Field.Root>

                    <Field.Root required w="full">
                      <Field.Label fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color={subtitleColor} mb={1.5}>
                        Logo Image URL <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        placeholder="https://example.com/logo.png"
                        value={logo}
                        onChange={(e) => setLogo(e.target.value)}
                        borderRadius="xl"
                        size="md"
                      />
                    </Field.Root>

                    <Field.Root required w="full">
                      <Field.Label fontSize="xs" fontWeight="700" textTransform="uppercase" letterSpacing="wider" color={subtitleColor} mb={1.5}>
                        Brand Color Code <Field.RequiredIndicator />
                      </Field.Label>
                      <Flex gap={3} align="center">
                        <Input
                          placeholder="#005caa or #2563eb"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          borderRadius="xl"
                          size="md"
                          flex={1}
                        />
                        <Box
                          w="38px"
                          h="38px"
                          borderRadius="xl"
                          bg={color || 'gray.200'}
                          border="1px solid"
                          borderColor={borderColor}
                          flexShrink={0}
                        />
                      </Flex>
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
                      onClick={handleAddBank}
                      bg="blue.500"
                      color="white"
                      _hover={{ bg: "blue.600" }}
                      borderRadius="xl"
                      size="sm"
                      fontWeight="600"
                    >
                      Save Bank
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
      </Box>
    </Box>
  );
}
