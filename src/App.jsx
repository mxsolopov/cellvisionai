import React from "react"
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import ImageDisplay from "./components/ImageDisplay"
import InfoPanel from "./components/InfoPanel"
import UploadBox from "./components/UploadBox"
import LoadingScreen from "./components/LoadingScreen"

const App = () => {
  const [imageData, setImageData] = React.useState([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [isUploaded, setIsUploaded] = React.useState(false)
  const [maskViewMode, setMaskViewMode] = React.useState("1")
  const [opacity, setOpacity] = React.useState(0.5)
  const [threshold, setThreshold] = React.useState(0.5)
  const [selectedModel, setSelectedModel] = React.useState("unet")
  const [executionTime, setExecutionTime] = React.useState(0)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [currentConfluency, setCurrentConfluency] = React.useState("0.00")
  const [totalConfluency, setTotalConfluency] = React.useState("0.00")

  const URL = "http://localhost:5000/"
  // const URL = "https://solopov.pro/"

  // Utility function to calculate confluency
  const calculateConfluency = (maskBase64) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = `data:image/png;base64,${maskBase64}`
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)
        const data = ctx.getImageData(0, 0, img.width, img.height).data

        const bluePixelCount = Array.from(data).filter(
          (_, i) =>
            i % 4 === 0 &&
            data[i] === 49 &&
            data[i + 1] === 130 &&
            data[i + 2] === 206
        ).length

        const totalPixels = img.width * img.height
        resolve(((bluePixelCount / totalPixels) * 100).toFixed(2))
      }
    })
  }

  // Function to calculate total confluency
  const calculateTotalConfluency = async () => {
    let totalBluePixelCount = 0
    let totalPixelsCount = 0

    await Promise.all(
      imageData.map(async (item) => {
        const img = new Image()
        img.src = `data:image/png;base64,${item.mask}`

        return new Promise((resolve) => {
          img.onload = () => {
            const canvas = document.createElement("canvas")
            canvas.width = img.width
            canvas.height = img.height
            const ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0)
            const data = ctx.getImageData(0, 0, img.width, img.height).data

            const bluePixelCount = Array.from(data).filter(
              (_, i) =>
                i % 4 === 0 &&
                data[i] === 49 &&
                data[i + 1] === 130 &&
                data[i + 2] === 206
            ).length

            totalBluePixelCount += bluePixelCount
            totalPixelsCount += img.width * img.height

            resolve()
          }
        })
      })
    )

    // Return total confluency as a number
    return ((totalBluePixelCount / totalPixelsCount) * 100).toFixed(2)
  }

  // Effect to calculate confluency when imageData or currentIndex changes
  React.useEffect(() => {
    if (imageData.length > 0 && imageData[currentIndex].mask) {
      calculateConfluency(imageData[currentIndex].mask).then(
        setCurrentConfluency
      )
      calculateTotalConfluency().then((total) =>
        setTotalConfluency(total)
      )
    }
  }, [currentIndex, imageData])

  // Reset function
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

  // Handle file submission
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
      setExecutionTime(((endTime - startTime) / 1000).toFixed(2))
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
              totalConfluency={totalConfluency}
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
