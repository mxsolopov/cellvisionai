import React from "react"
import { Box, Text, Center, Image, Flex } from "@chakra-ui/react"
import AnimatedLogo from "../assets/logo_animated.svg"

const LoadingScreen = () => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      zIndex="1000"
    >
      <Center height="100vh">
        <Flex direction="column" align="center">
          <Image src={AnimatedLogo} alt="Logo" width="120px" />
          <Text mt={4} fontSize="lg" color="gray.600">
            Загрузка и обработка изображений...
          </Text>
        </Flex>
      </Center>
    </Box>
  )
}

export default LoadingScreen
