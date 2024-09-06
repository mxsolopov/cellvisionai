import React from "react"
import { Box, Heading, Text, Button, VStack, HStack, Flex } from "@chakra-ui/react"

const InfoPanel = () => {
  return (
    <Flex w="25%" direction="column" gap="4">
      <Box p={4} borderWidth={1} borderRadius="md">
        <VStack align="start" spacing={4}>
          <Heading size="md">Информация</Heading>
          <Text>Текущая конфлуэнтность - 45%</Text>
          <Text>Общая конфлуэнтность - 45%</Text>
          <Text>Время обработки - 45 сек</Text>
        </VStack>
      </Box>
      <Box p={4} borderWidth={1} borderRadius="md">
        <VStack align="start" spacing={4}>
          <Heading size="md">Выходные файлы</Heading>
          <Text>Скачать маску</Text>
          <HStack>
            <Button>PNG</Button>
            <Button>JSON</Button>
          </HStack>
          <Text>Скачать все маски</Text>
          <HStack>
            <Button>PNG</Button>
            <Button>JSON</Button>
          </HStack>
          <Text>Скачать все маски + изображения</Text>
          <HStack>
            <Button>PNG</Button>
            <Button>JSON</Button>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  )
}

export default InfoPanel
