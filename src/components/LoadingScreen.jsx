import React from "react"
import { ChakraProvider, Box, Spinner, Text, Center } from "@chakra-ui/react"

const LoadingScreen = () => {
  return (
    <ChakraProvider>
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        bg="white"
        zIndex="1000"
      >
        <Center height="100vh">
          <Box textAlign="center">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="purple.500"
              size="xl"
            />
            <Text mt={4} fontSize="lg" color="gray.600">
              Загрузка и обработка изображений...
            </Text>
          </Box>
        </Center>
      </Box>
    </ChakraProvider>
  )
}

export default LoadingScreen
