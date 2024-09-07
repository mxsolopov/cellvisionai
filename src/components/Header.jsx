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
} from "@chakra-ui/react"
import Logo from "../assets/logo.svg"

const Header = ({ isUploaded }) => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Flex justify="space-between" align="center">
      <HStack spacing={8}>
        <HStack>
          <Image src={Logo} alt="Logo" />
          <Heading size="lg" fontWeight="bold" color="purple.600">
            CellVision.AI
          </Heading>
        </HStack>
        <HStack>
          <Text>Светлая тема</Text>
          <Switch
            size="lg"
            isChecked={colorMode === "dark"}
            onChange={toggleColorMode}
          />
          <Text>Тёмная тема</Text>
        </HStack>
      </HStack>
      <HStack spacing={6}>
        <Link href="#" fontWeight="500">
          Датасет
        </Link>
        <Link href="#" fontWeight="500">
          Статья
        </Link>
        <Link href="#" fontWeight="500">
          GitHub
        </Link>
        <Link href="#" fontWeight="500">
          Задать вопрос
        </Link>
        {isUploaded ? (
          <Button colorScheme="blue">Новая сегментация</Button>
        ) : (
          <></>
        )}
      </HStack>
    </Flex>
  )
}

Header.propTypes = {
  isUploaded: PropTypes.bool.isRequired,
}

export default Header
