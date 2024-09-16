import React from "react"
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import ImageDisplay from "./components/ImageDisplay"
import InfoPanel from "./components/InfoPanel"
import UploadBox from "./components/UploadBox"
import LoadingScreen from "./components/LoadingScreen"

const App = () => {
  const [imageData, setImageData] = React.useState([]) // Объединяем изображения и маски в один стейт
  const [isUploading, setIsUploading] = React.useState(false)
  const [isUploaded, setIsUploaded] = React.useState(false)
  const [maskViewMode, setMaskViewMode] = React.useState("1")
  const [opacity, setOpacity] = React.useState(0.2)
  const [threshold, setThreshold] = React.useState(0.5)
  const [selectedModel, setSelectedModel] = React.useState("unet")
  const [executionTime, setExecutionTime] = React.useState(0)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [currentConfluency, setCurrentConfluency] = React.useState(0)

  const calculateConfluency = (maskBase64) => {
    const img = new Image()
    img.src = `data:image/png;base64,${maskBase64}`

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const data = imageData.data

        let whitePixelCount = 0
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] === 255 && data[i + 1] === 255 && data[i + 2] === 255) {
            whitePixelCount++
          }
        }

        const totalPixels = img.width * img.height
        const confluency = ((whitePixelCount / totalPixels) * 100).toFixed(2)

        resolve(confluency)
      }
    })
  }

  React.useEffect(() => {
    if (imageData.length > 0 && imageData[currentIndex].mask) {
      calculateConfluency(imageData[currentIndex].mask).then(
        setCurrentConfluency
      )
    }
  }, [currentIndex, imageData])

  // const URL = "http://localhost:5000/"
  const URL = "https://solopov.pro/"

  const resetSegmentation = () => {
    setImageData([])
    setIsUploading(false)
    setIsUploaded(false)
    setMaskViewMode("1")
    setOpacity(0.2)
    setThreshold(0.5)
    setSelectedModel("unet")
    setExecutionTime(0)
    setCurrentIndex(0)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setIsUploading(true)
    const promises = []

    const startTime = performance.now()

    const addFileWithDelay = async (index) => {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const formData = new FormData()
      formData.append("images", imageData[index].file)
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
            setImageData((prevData) =>
              prevData.map((item, idx) =>
                idx === index ? { ...item, mask: data.mask_base64 } : item
              )
            )
          } else {
            console.error("File upload failed:", data.error)
          }
        })
        .catch((error) => {
          console.error("File upload failed:", error)
        })

      promises.push(promise)
    }

    for (let i = 0; i < imageData.length; i++) {
      await addFileWithDelay(i)
    }

    Promise.all(promises).then(() => {
      const endTime = performance.now()
      const executionTime = ((endTime - startTime) / 1000).toFixed(2)
      setExecutionTime(parseFloat(executionTime))
      setIsUploaded(true)
      setIsUploading(false)
    })
  }

  const isMobile = useBreakpointValue({ base: true, md: false })

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
          <Flex mt={4} direction={{ base: "column", md: "row" }}>
            {isMobile && (
              <ImageDisplay
                imageData={imageData}
                maskViewMode={maskViewMode}
                opacity={opacity}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            )}
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
            {!isMobile && (
              <ImageDisplay
                imageData={imageData}
                maskViewMode={maskViewMode}
                opacity={opacity}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
              />
            )}
            <InfoPanel
              imageData={imageData}
              executionTime={executionTime}
              currentConfluency={currentConfluency}
              calculateConfluency={calculateConfluency}
            />
          </Flex>
        </Box>
      ) : (
        <Box p={4}>
          <Header
            isUploaded={isUploaded}
            resetSegmentation={resetSegmentation}
          />
          <UploadBox
            imageData={imageData}
            setImageData={setImageData}
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
