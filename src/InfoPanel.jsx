import React from "react"
import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react"

const InfoPanel = () => {
  return (
    <Box w="20%" p={4} borderWidth={1} borderRadius="md">
      <VStack align="start" spacing={4}>
        <Heading size="md">Информация</Heading>
        <Text>Текущая конфлуэнтность - 45%</Text>
        <Text>Общая конфлуэнтность - 45%</Text>
        <Text>Время обработки - 45 сек</Text>
        <Heading size="md">Выходные файлы</Heading>
        <Button>Скачать просматриваемую маску PNG</Button>
        <Button>Скачать просматриваемую маску JSON</Button>
        <Button>Скачать все маски PNG</Button>
        <Button>Скачать все маски JSON</Button>
        <Button>Скачать маски + изображения PNG</Button>
        <Button>Скачать маски + изображения JSON</Button>
      </VStack>
    </Box>
  )
}

export default InfoPanel
