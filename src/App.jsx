import React from "react"
import { Box, Flex } from "@chakra-ui/react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import ImageDisplay from "./ImageDisplay"
import InfoPanel from "./InfoPanel"

const App = () => {
  return (
    <Box p={4}>
      <Header />
      <Flex mt={4}>
        <Sidebar />
        <ImageDisplay />
        <InfoPanel />
      </Flex>
    </Box>
  )
}

export default App
