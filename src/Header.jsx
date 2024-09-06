import React from "react"
import { Flex, Heading, Text, Button, HStack, Switch, Link } from "@chakra-ui/react"

const Header = () => {
  return (
    <Flex justify="space-between" align="center">
      <HStack spacing={4}>
        <Heading size="lg">CellVision.AI</Heading>
        <Switch size="lg" />
        <Text>Тёмная тема</Text>
      </HStack>
      <HStack spacing={4}>
        <Link href="#">Датасет</Link>
        <Link href="#">Статья</Link>
        <Link href="#">GitHub</Link>
        <Link href="#">Задать вопрос</Link>
        <Button colorScheme="blue">Новая сегментация</Button>
      </HStack>
    </Flex>
  )
}

export default Header
