import React from "react"
import PropTypes from "prop-types"
import {
  Flex,
  Heading,
  Text,
  Button,
  HStack,
  Switch,
  Link,
  Image,
  useColorMode,
  useDisclosure,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react"
import { HamburgerIcon } from "@chakra-ui/icons"
import Logo from "../assets/logo.svg"

const NavigationLinks = ({ isUploaded, resetSegmentation }) => (
  <Flex direction={{ base: "column", md: "row" }} gap={6} align={{ base: "start", md: "center" }}>
    <Link
      href="https://github.com/mxsolopov/cellvisionai"
      target="_blank"
      isExternal
      fontWeight="500"
    >
      Датасет
    </Link>
    <Link
      href="https://github.com/mxsolopov/cellvisionai"
      target="_blank"
      isExternal
      fontWeight="500"
    >
      Статья
    </Link>
    <Link
      href="https://github.com/mxsolopov/cellvisionai"
      target="_blank"
      isExternal
      fontWeight="500"
    >
      GitHub
    </Link>
    <Link
      href="https://t.me/mxsolopov"
      target="_blank"
      isExternal
      fontWeight="500"
    >
      Задать вопрос
    </Link>
    {isUploaded && (
      <Button colorScheme="blue" onClick={resetSegmentation}>
        Новая сегментация
      </Button>
    )}
  </Flex>
)

const ThemeSwitcher = ({ colorMode, toggleColorMode }) => (
  <HStack spacing={2} align="center" mb={{ base: 4, md: 0 }}>
    <Text fontSize="20px">🌞</Text>
    <Switch
      size="lg"
      isChecked={colorMode === "dark"}
      onChange={toggleColorMode}
    />
    <Text fontSize="20px">🌜</Text>
  </HStack>
)

const Header = ({ isUploaded, resetSegmentation }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex justify="space-between" align="center" position="relative">
      <HStack spacing={8}>
        <HStack spacing={0}>
          <Image src={Logo} alt="Logo" width="62px" />
          <Heading size="lg" fontWeight="bold" color="purple.600">
            CellVision.AI
          </Heading>
        </HStack>
        <HStack display={{ base: "none", md: "flex" }}>
          <ThemeSwitcher
            colorMode={colorMode}
            toggleColorMode={toggleColorMode}
          />
        </HStack>
      </HStack>
      <HStack spacing={6} display={{ base: "none", md: "flex" }}>
        <NavigationLinks
          isUploaded={isUploaded}
          resetSegmentation={resetSegmentation}
        />
      </HStack>
      <IconButton
        icon={<HamburgerIcon />}
        onClick={onOpen}
        aria-label="Open Menu"
        display={{ base: "flex", md: "none" }}
        position="fixed"
        top={6}
        right={4}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Меню</DrawerHeader>
          <DrawerBody>
            <Flex direction="column" justify="space-between" height="100%">
              <NavigationLinks
                isUploaded={isUploaded}
                resetSegmentation={resetSegmentation}
              />
              <ThemeSwitcher
                colorMode={colorMode}
                toggleColorMode={toggleColorMode}
                mb={3}
              />
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

Header.propTypes = {
  isUploaded: PropTypes.bool.isRequired,
  resetSegmentation: PropTypes.func.isRequired,
}

export default Header
