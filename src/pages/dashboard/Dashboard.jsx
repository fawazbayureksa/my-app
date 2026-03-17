import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  Grid,
  Card,
  Flex,
  Spinner,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { useColorModeValue } from '../../components/ui/color-mode';
import { api } from '../../components/axios/Config';
import { toaster } from '../../components/ui/toaster';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPieChart,
} from 'react-icons/fi';

// Dashboard Components
import StatCard from '../../components/dashboard/StatCard';
import MonthlyComparisonChart from '../../components/dashboard/MonthlyComparisonChart';
import CategoryDonutChart from '../../components/dashboard/CategoryDonutChart';
import NetSavingsChart from '../../components/dashboard/NetSavingsChart';
import { VisibilityToggle } from '../../components/ui/VisibilityToggle';
import { PayCycleToggle } from '../../components/ui/PayCycleToggle';
import { useLocalValueVisibility } from '../../hooks/useValueVisibility';

/**
 * Format currency for IDR
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Analytics Dashboard Component
 */
const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState(null);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [loadingYearly, setLoadingYearly] = useState(true);
  const [usePayCycle, setUsePayCycle] = useState(false);

  // Handle pay cycle toggle
  const handlePayCycleToggle = useCallback((isEnabled) => {
    setUsePayCycle(isEnabled);
  }, []);

  // Colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');
  const headerBg = useColorModeValue(
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)'
  );
  const pageBg = useColorModeValue('gray.50', 'gray.900');

  const fetchMonthlyComparison = useCallback(async () => {
    try {
      const params = { months: 6 };
      if (usePayCycle) {
        params.use_pay_cycle = 'true';
      }
      const response = await api.get('analytics/monthly-comparison', { params });
      setMonthlyData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching monthly comparison:', error);
      toaster.create({
        description: "Failed to fetch monthly comparison",
        type: "error",
      });
    } finally {
      setLoadingMonthly(false);
    }
  }, [usePayCycle]);

  const fetchYearlyReport = useCallback(async () => {
    try {
      const currentYear = new Date().getFullYear();
      const params = { year: currentYear };
      if (usePayCycle) {
        params.use_pay_cycle = 'true';
      }
      const response = await api.get('analytics/yearly-report', { params });
      setYearlyData(response.data.data || null);
    } catch (error) {
      console.error('Error fetching yearly report:', error);
      toaster.create({
        description: "Failed to fetch yearly report",
        type: "error",
      });
    } finally {
      setLoadingYearly(false);
    }
  }, [usePayCycle]);

  useEffect(() => {
    // Get user name
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || 'User');
      } catch {
        setUserName('User');
      }
    }

    // Fetch data
    fetchMonthlyComparison();
    fetchYearlyReport();
  }, [fetchMonthlyComparison, fetchYearlyReport]);

  // Calculate latest changes from monthly data
  const latestIncome = monthlyData[monthlyData.length - 1]?.income || 0;
  const latestExpense = monthlyData[monthlyData.length - 1]?.expense || 0;
  const latestNet = monthlyData[monthlyData.length - 1]?.net || 0;
  const incomeChange = monthlyData[monthlyData.length - 1]?.income_change || 0;
  const expenseChange = monthlyData[monthlyData.length - 1]?.expense_change || 0;

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

    // Value visibility hook
  const { isHidden, toggleVisibility, formatValue } = useLocalValueVisibility();
  
   // Format currency with visibility check
  const displayCurrency = (amount) => {
    return formatValue(amount, formatCurrency);
  };



  // Savings rate calculation
  const savingsRate = yearlyData?.total_income > 0
    ? ((yearlyData.net_savings / yearlyData.total_income) * 100).toFixed(1)
    : 0;

  return (
    <Box minH="100vh" bg={pageBg}>
    <Box maxW="7xl" mx="auto" px={4} py={6}>
      {/* Header Hero Card */}
      <Box
        mb={8}
        p={6}
        borderRadius="2xl"
        bgGradient={headerBg}
        color="white"
        position="relative"
        overflow="hidden"
      >
        {/* Decorative circles */}
        <Box
          position="absolute" top="-20px" right="-20px"
          w="120px" h="120px" borderRadius="full"
          bg="whiteAlpha.100"
        />
        <Box
          position="absolute" bottom="-30px" right="80px"
          w="80px" h="80px" borderRadius="full"
          bg="whiteAlpha.100"
        />
        <Flex justify="space-between" align="flex-start" wrap="wrap" gap={4}>
          <Box>
            <Text fontSize="sm" fontWeight="medium" opacity={0.8} mb={1} letterSpacing="wide">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
            <Heading as="h1" size="xl" fontWeight="bold" mb={1} color="white">
              {getGreeting()}, {userName} 👋
            </Heading>
            <Text opacity={0.85} fontSize="md">
              Here's your financial overview
            </Text>
          </Box>
          <Flex gap={2} align="center" pt={1}>
            <Box
              bg="whiteAlpha.200"
              px={3} py={2}
              borderRadius="xl"
              backdropFilter="blur(8px)"
            >
              <PayCycleToggle isEnabled={usePayCycle} onToggle={handlePayCycleToggle} />
            </Box>
            <Box
              bg="whiteAlpha.200"
              borderRadius="xl"
              backdropFilter="blur(8px)"
            >
              <VisibilityToggle isHidden={isHidden} onToggle={toggleVisibility} />
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Summary Stats */}
      {loadingYearly ? (
        <Flex justify="center" py={8}>
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={6}
          mb={8}
        >
          <StatCard
            title="Total Income"
            value={yearlyData?.total_income || 0}
            formatValue={displayCurrency}
            icon={FiTrendingUp}
            colorScheme="green"
            change={incomeChange}
            changeLabel="vs last month"
          />
          <StatCard
            title="Total Expense"
            value={yearlyData?.total_expense || 0}
            formatValue={displayCurrency}
            icon={FiTrendingDown}
            colorScheme="red"
            change={expenseChange}
            changeLabel="vs last month"
          />
          <StatCard
            title="Net Savings"
            value={yearlyData?.net_savings || 0}
            formatValue={displayCurrency}
            icon={FiDollarSign}
            colorScheme="blue"
          />
          <StatCard
            title="Savings Rate"
            value={`${savingsRate}%`}
            icon={FiPieChart}
            colorScheme="purple"
            change={parseFloat(savingsRate) > 20 ? parseFloat(savingsRate) - 20 : parseFloat(savingsRate) - 20}
            changeLabel="vs 20% goal"
          />
        </Grid>
      )}

      {/* Charts Row: Monthly Comparison + Net Savings side-by-side */}
      <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={6} mb={8}>
        {/* Monthly Comparison */}
        <Card.Root
          bg={cardBg}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
        >
          <Card.Body p={6}>
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading as="h3" size="md" fontWeight="bold">
                  Income vs Expense
                </Heading>
                <Text color={subtitleColor} fontSize="sm">
                  Last 6 months comparison
                </Text>
              </Box>
              <Badge colorPalette="blue" variant="subtle" px={3} py={1} borderRadius="full">
                Monthly
              </Badge>
            </Flex>
            {loadingMonthly ? (
              <Flex justify="center" py={12}>
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : (
              <MonthlyComparisonChart data={monthlyData} />
            )}
          </Card.Body>
        </Card.Root>

        {/* Net Savings Trend */}
        <Card.Root
          bg={cardBg}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
        >
          <Card.Body p={6}>
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading as="h3" size="md" fontWeight="bold">
                  Net Savings
                </Heading>
                <Text color={subtitleColor} fontSize="sm">
                  Savings over time
                </Text>
              </Box>
              <Icon as={FiTrendingUp} boxSize={5} color="blue.500" />
            </Flex>
            {loadingMonthly ? (
              <Flex justify="center" py={12}>
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : (
              <NetSavingsChart data={monthlyData} />
            )}
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* Category Breakdown */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        {/* Top Expense Categories */}
        <Card.Root
          bg={cardBg}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
        >
          <Card.Body p={6}>
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading as="h3" size="md" fontWeight="bold">
                  Top Expenses
                </Heading>
                <Text color={subtitleColor} fontSize="sm">
                  Where your money goes
                </Text>
              </Box>
              <Badge colorPalette="red" variant="subtle" px={3} py={1} borderRadius="full">
                Expense
              </Badge>
            </Flex>

            {loadingYearly ? (
              <Flex justify="center" py={12}>
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : (
              <CategoryDonutChart
                data={yearlyData?.top_expense_categories || []}
                emptyMessage="No expense data available"
              />
            )}
          </Card.Body>
        </Card.Root>

        {/* Top Income Categories */}
        <Card.Root
          bg={cardBg}
          borderRadius="2xl"
          border="1px solid"
          borderColor={borderColor}
          overflow="hidden"
        >
          <Card.Body p={6}>
            <Flex justify="space-between" align="center" mb={4}>
              <Box>
                <Heading as="h3" size="md" fontWeight="bold">
                  Top Income Sources
                </Heading>
                <Text color={subtitleColor} fontSize="sm">
                  Where your money comes from
                </Text>
              </Box>
              <Badge colorPalette="green" variant="subtle" px={3} py={1} borderRadius="full">
                Income
              </Badge>
            </Flex>

            {loadingYearly ? (
              <Flex justify="center" py={12}>
                <Spinner size="xl" color="blue.500" />
              </Flex>
            ) : (
              <CategoryDonutChart
                data={yearlyData?.top_income_categories || []}
                emptyMessage="No income data available"
              />
            )}
          </Card.Body>
        </Card.Root>
      </Grid>

      {/* Quick Stats Footer */}
      <Box mt={8}>
        <Heading as="h3" size="sm" fontWeight="semibold" color={subtitleColor} mb={3} textTransform="uppercase" letterSpacing="wider">
          This Month Summary
        </Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
          <Box
            p={5}
            borderRadius="2xl"
            bg={useColorModeValue('green.50', 'green.900')}
            border="1px solid"
            borderColor={useColorModeValue('green.200', 'green.700')}
          >
            <Flex align="center" gap={3}>
              <Flex
                w={10} h={10} align="center" justify="center"
                borderRadius="xl" bg={useColorModeValue('green.100', 'green.800')}
              >
                <Icon as={FiTrendingUp} boxSize={5} color={useColorModeValue('green.600', 'green.300')} />
              </Flex>
              <Box>
                <Text fontSize="xs" fontWeight="medium" color={useColorModeValue('green.700', 'green.300')} textTransform="uppercase" letterSpacing="wide">
                  Income
                </Text>
                <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('green.700', 'green.200')}>
                  {displayCurrency(latestIncome)}
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box
            p={5}
            borderRadius="2xl"
            bg={useColorModeValue('red.50', 'red.900')}
            border="1px solid"
            borderColor={useColorModeValue('red.200', 'red.700')}
          >
            <Flex align="center" gap={3}>
              <Flex
                w={10} h={10} align="center" justify="center"
                borderRadius="xl" bg={useColorModeValue('red.100', 'red.800')}
              >
                <Icon as={FiTrendingDown} boxSize={5} color={useColorModeValue('red.600', 'red.300')} />
              </Flex>
              <Box>
                <Text fontSize="xs" fontWeight="medium" color={useColorModeValue('red.700', 'red.300')} textTransform="uppercase" letterSpacing="wide">
                  Expense
                </Text>
                <Text fontSize="xl" fontWeight="bold" color={useColorModeValue('red.700', 'red.200')}>
                  {displayCurrency(latestExpense)}
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box
            p={5}
            borderRadius="2xl"
            bg={useColorModeValue(latestNet >= 0 ? 'blue.50' : 'orange.50', latestNet >= 0 ? 'blue.900' : 'orange.900')}
            border="1px solid"
            borderColor={useColorModeValue(latestNet >= 0 ? 'blue.200' : 'orange.200', latestNet >= 0 ? 'blue.700' : 'orange.700')}
          >
            <Flex align="center" gap={3}>
              <Flex
                w={10} h={10} align="center" justify="center"
                borderRadius="xl"
                bg={useColorModeValue(latestNet >= 0 ? 'blue.100' : 'orange.100', latestNet >= 0 ? 'blue.800' : 'orange.800')}
              >
                <Icon as={FiDollarSign} boxSize={5} color={useColorModeValue(latestNet >= 0 ? 'blue.600' : 'orange.600', latestNet >= 0 ? 'blue.300' : 'orange.300')} />
              </Flex>
              <Box>
                <Text fontSize="xs" fontWeight="medium"
                  color={useColorModeValue(latestNet >= 0 ? 'blue.700' : 'orange.700', latestNet >= 0 ? 'blue.300' : 'orange.300')}
                  textTransform="uppercase" letterSpacing="wide"
                >
                  Net
                </Text>
                <Text fontSize="xl" fontWeight="bold"
                  color={useColorModeValue(latestNet >= 0 ? 'blue.700' : 'orange.700', latestNet >= 0 ? 'blue.200' : 'orange.200')}
                >
                  {displayCurrency(latestNet)}
                </Text>
              </Box>
            </Flex>
          </Box>
        </Grid>
      </Box>
    </Box>
    </Box>
  );
};

export default Dashboard;