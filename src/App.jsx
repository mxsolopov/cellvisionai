import React from "react"
import { Box, Flex } from "@chakra-ui/react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import ImageDisplay from "./components/ImageDisplay"
import InfoPanel from "./components/InfoPanel"
import UploadBox from "./components/UploadBox"
import LoadingScreen from "./components/LoadingScreen"

const App = () => {
  const [images, setImages] = React.useState(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isUploaded, setIsUploaded] = React.useState(false)
  const [masks, setMasks] = React.useState([])
  const [maskViewMode, setMaskViewMode] = React.useState("1")
  const [opacity, setOpacity] = React.useState(0.2)
  const [threshold, setThreshold] = React.useState(0.5)
  const [selectedModel, setSelectedModel] = React.useState("unet")
  const [executionTime, setExecutionTime] = React.useState(0)

  const URL = "http://127.0.0.1:5000"

  const resetSegmentation = () => {
    setImages(null)
    setIsUploading(false)
    setIsUploaded(false)
    setMasks([])
    setMaskViewMode("1")
    setOpacity(0.2)
    setThreshold(0.5)
    setSelectedModel("unet")
    setExecutionTime(0)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsUploading(true)
    setMasks([]) // Очистите маски перед загрузкой новых

    const promises = []

    const startTime = performance.now() // Start time

    const addFileWithDelay = async (index) => {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const formData = new FormData()
      formData.append("images", images[index])
      formData.append("model", selectedModel)
      formData.append("threshold", threshold)

      const promise = fetch(`${URL}/upload-cv`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.mask_base64) {
            console.log("File uploaded successfully:", data.mask_base64)
            setMasks((prevMasks) => [...prevMasks, data.mask_base64])
          } else {
            console.error("File upload failed:", data.error)
          }
        })
        .catch((error) => {
          console.error("File upload failed:", error)
        })

      promises.push(promise)
    }

    for (let i = 0; i < images.length; i++) {
      await addFileWithDelay(i)
    }

    Promise.all(promises).then(() => {
      const endTime = performance.now() // End time
      const executionTime = ((endTime - startTime) / 1000).toFixed(2) // Execution time in seconds
      setExecutionTime(executionTime) // Save execution time to state
      setIsUploaded(true)
      setIsUploading(false)
    })
  }

  return (
    <>
      {isUploading ? (
        <LoadingScreen />
      ) : isUploaded ? (
        <Box p={4}>
          <Header
            isUploaded={isUploaded}
            resetSegmentation={resetSegmentation}
          />
          <Flex mt={4}>
            <Sidebar
              maskViewMode={maskViewMode}
              setMaskViewMode={setMaskViewMode}
              opacity={opacity}
              setOpacity={setOpacity}
              threshold={threshold}
              setThreshold={setThreshold}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              handleSubmit={handleSubmit}
            />
            <ImageDisplay
              images={images}
              masks={masks}
              maskViewMode={maskViewMode}
              opacity={opacity}
            />
            <InfoPanel images={images} masks={masks} executionTime={executionTime} />
          </Flex>
        </Box>
      ) : (
        <Box p={4}>
          <Header
            isUploaded={isUploaded}
            resetSegmentation={resetSegmentation}
          />
          <UploadBox
            images={images}
            setImages={setImages}
            handleSubmit={handleSubmit}
            isUploading={isUploading}
            isUploaded={isUploaded}
          />
        </Box>
      )}
    </>
  )
}

export default App
