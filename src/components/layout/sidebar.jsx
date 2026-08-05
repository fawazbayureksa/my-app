import React, { useState } from 'react'
import {
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  useBreakpointValue,
  Circle,
  IconButton,
  HStack,
  Image,
} from '@chakra-ui/react'
import { useColorModeValue } from '../ui/color-mode'
import logoImg from '../../assets/logo.png'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { menuGroups } from '../../constant'
import {
  FiMenu,
  FiX,
  FiList
} from 'react-icons/fi';

const MotionBox = motion(Box)

const Sidebar = () => {
  const location = useLocation()
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const [isOpen, setIsOpen] = useState(false)

  // Safe parsing for stored user (object or simple string)
  const getUserName = () => {
    try {
      const stored = localStorage.getItem('user')
      if (!stored) return 'User'
      if (stored.startsWith('{')) {
        const parsed = JSON.parse(stored)
        return parsed.name || parsed.username || parsed.email || 'User'
      }
      return stored
    } catch {
      return 'User'
    }
  }

  const username = getUserName()


  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.92)', 'rgba(15, 23, 42, 0.92)')
  const activeBg = useColorModeValue('blue.50/80', 'blue.950/40')
  const hoverBg = useColorModeValue('gray.100/70', 'whiteAlpha.100')
  const activeColor = useColorModeValue('blue.600', 'blue.400')
  const inactiveColor = useColorModeValue('gray.600', 'gray.400')
  const sectionTitleColor = useColorModeValue('gray.400', 'gray.500')
  const borderColor = useColorModeValue('gray.200/70', 'whiteAlpha.100')

  const SidebarContent = ({ onItemClick }) => (
    <VStack align="stretch" spacing={5} py={1}>
      {menuGroups.map((group, groupIdx) => (
        <Box key={groupIdx}>
          <Text
            fontSize="10px"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="0.08em"
            color={sectionTitleColor}
            mb={2}
            px={3}
          >
            {group.title}
          </Text>
          <VStack align="stretch" spacing={0.5}>
            {group.items.map((item, itemIdx) => {
              const isActive = location.pathname === item.path
              return (
                <Link to={item.path} key={itemIdx} onClick={onItemClick}>
                  <Flex
                    align="center"
                    py="2"
                    px="3"
                    borderRadius="lg"
                    position="relative"
                    bg={isActive ? activeBg : 'transparent'}
                    color={isActive ? activeColor : inactiveColor}
                    _hover={{
                      bg: isActive ? activeBg : hoverBg,
                      color: activeColor,
                    }}
                    transition="all 0.15s ease-in-out"
                    fontWeight={isActive ? '600' : '500'}
                    role="group"
                  >
                    {/* Minimal Left Active Bar */}
                    {isActive && (
                      <Box
                        position="absolute"
                        left="0"
                        top="25%"
                        bottom="25%"
                        w="3px"
                        bg="blue.500"
                        borderRadius="full"
                      />
                    )}
                    <Icon
                      as={item.icon}
                      boxSize={4}
                      mr={3}
                      transition="transform 0.15s ease"
                      _groupHover={{ transform: 'scale(1.08)' }}
                    />
                    <Text fontSize="13px" flex="1">
                      {item.label}
                    </Text>
                  </Flex>
                </Link>
              )
            })}
          </VStack>
        </Box>
      ))}

      {/* Clean User Profile Section (No extra cards/heavy borders) */}
      <Box pt="3" borderTop="1px solid" borderColor={borderColor}>
        <HStack spacing={3} px={2} py={1.5} align="center">
          <Circle size="32px" bg="blue.500" color="white" fontWeight="600" fontSize="xs">
            {username.charAt(0).toUpperCase()}
          </Circle>
          <Box overflow="hidden" flex="1">
            <Text fontSize="12px" fontWeight="600" truncate color={useColorModeValue('gray.800', 'gray.200')}>
              {username}
            </Text>
            <HStack spacing={1.5} align="center">
              <Circle size="5px" bg="emerald.400" />
              <Text fontSize="10px" color={sectionTitleColor} fontWeight="500">
                Online
              </Text>
            </HStack>
          </Box>
        </HStack>
      </Box>
    </VStack>
  )

  if (isMobile) {
    return (
      <>
        {/* Floating Toggle Button */}
        <Box position="fixed" bottom="6" right="6" zIndex={1500}>
          <IconButton
            size="lg"
            rounded="full"
            colorPalette="blue"
            shadow="xl"
            onClick={() => setIsOpen(!isOpen)}
            variant="solid"
            _active={{ transform: 'scale(0.92)' }}
            transition="0.2s"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </IconButton>
        </Box>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <MotionBox
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.18 }}
              position="fixed"
              bottom="22"
              right="6"
              w="270px"
              maxH="75vh"
              bg={glassBg}
              backdropFilter="blur(20px)"
              borderRadius="2xl"
              boxShadow="2xl"
              p="4"
              zIndex={1500}
              border="1px solid"
              borderColor={borderColor}
              overflowY="auto"
            >
              <SidebarContent onItemClick={() => setIsOpen(false)} />
            </MotionBox>
          )}
        </AnimatePresence>

        {/* Backdrop for mobile */}
        <AnimatePresence>
          {isOpen && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              position="fixed"
              inset="0"
              bg="blackAlpha.400"
              backdropFilter="blur(3px)"
              zIndex={1400}
              onClick={() => setIsOpen(false)}
            />
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop Glassmorphism Sidebar
  return (
    <Box
      w="250px"
      h="100vh"
      p="4"
      position="fixed"
      left="0"
      top="0"
      bg={glassBg}
      backdropFilter="blur(16px)"
      borderRight="1px solid"
      borderColor={borderColor}
      overflowY="auto"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      css={{
        '&::-webkit-scrollbar': { width: '4px' },
        '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.1)', borderRadius: '4px' },
      }}
    >
      <Box>
        {/* Sleek Brand Header */}
        <Link to="/">
          <HStack mb="5" px="2" pt="1" gap={2.5} align="center">
            <Image
              src={logoImg}
              alt="MoneyManage Logo"
              boxSize="34px"
              objectFit="contain"
              borderRadius="md"
            />
            <Box>
              <Text
                fontSize="lg"
                fontWeight="800"
                letterSpacing="-0.02em"
                lineHeight="1.2"
                color={useColorModeValue('gray.900', 'white')}
              >
                Money
                <Text as="span" color="blue.500">
                  Manage
                </Text>
              </Text>
              <Text fontSize="9px" fontWeight="600" color="gray.400" letterSpacing="0.06em" textTransform="uppercase">
                Personal Finance
              </Text>
            </Box>
          </HStack>
        </Link>

        {/* Navigation Content */}
        <SidebarContent />
      </Box>
    </Box>
  )
}

export default Sidebar



