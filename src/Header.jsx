import React from "react"
import {
  Flex,
  Heading,
  Text,
  Button,
  HStack,
  Switch,
  Link,
  Image,
} from "@chakra-ui/react"
import Logo from "./assets/logo.svg"

const Header = () => {
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
          <Switch size="lg" />
          <Text>Тёмная тема</Text>
        </HStack>
      </HStack>
      <HStack spacing={6}>
        <Link href="#" fontWeight="500">Датасет</Link>
        <Link href="#" fontWeight="500">Статья</Link>
        <Link href="#" fontWeight="500">GitHub</Link>
        <Link href="#" fontWeight="500">Задать вопрос</Link>
        <Button colorScheme="blue">Новая сегментация</Button>
      </HStack>
    </Flex>
  )
}

export default Header
