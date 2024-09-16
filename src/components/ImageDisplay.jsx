import React from "react"
import PropTypes from "prop-types"
import { Flex, Button, Image, HStack, Text, Box } from "@chakra-ui/react"

const ImageDisplay = ({
  imageData,
  opacity,
  maskViewMode,
  currentIndex,
  setCurrentIndex,
}) => {
  const [imagesURLs, setImagesURLs] = React.useState([])

  React.useEffect(() => {
    const urls = imageData.map((item) => {
      const reader = new FileReader()
      reader.readAsDataURL(item.file)
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result)
        }
      })
    })

    Promise.all(urls).then(setImagesURLs)
  }, [imageData])

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageData.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageData.length - 1 : prevIndex - 1
    )
  }

  return (
    <Flex
      w={{ base: "100%", md: "50%" }}
      direction="column"
      align="center"
      gap={4}
    >
      <Box
        position="relative"
        w={{ base: "90vw", md: "500px" }}
        h={{ base: "90vw", md: "500px" }}
        overflow="hidden"
      >
        {imagesURLs.length > 0 && (
          <Image
            w={{ base: "90vw", md: "500px" }}
            src={imagesURLs[currentIndex]}
            alt="Original Image"
            position="absolute"
            top="0"
            left="0"
            zIndex="1"
          />
        )}
        {imageData[currentIndex].mask && (
          <Image
            w={{ base: "90vw", md: "500px" }}
            src={`data:image/png;base64,${imageData[currentIndex].mask}`}
            alt="Mask Image"
            position="absolute"
            top="0"
            left="0"
            zIndex="2"
            opacity={maskViewMode == "1" ? 1 : opacity}
            mixBlendMode={maskViewMode == "3" ? "overlay" : ""}
            display={maskViewMode == "2" ? "none" : ""}
          />
        )}
      </Box>
      <HStack>
        <Button
          size="sm"
          onClick={handlePrev}
          disabled={imageData.length === 0}
        >
          Назад
        </Button>
        <Text>
          {imageData.length > 0
            ? `${currentIndex + 1} из ${imageData.length}`
            : "Нет изображений"}
        </Text>
        <Button
          size="sm"
          onClick={handleNext}
          disabled={imageData.length === 0}
        >
          Далее
        </Button>
      </HStack>
    </Flex>
  )
}

ImageDisplay.propTypes = {
  imageData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      file: PropTypes.instanceOf(File).isRequired,
      mask: PropTypes.string,
    })
  ).isRequired,
  opacity: PropTypes.number.isRequired,
  maskViewMode: PropTypes.string.isRequired,
  currentIndex: PropTypes.number.isRequired,
  setCurrentIndex: PropTypes.func.isRequired,
}

export default ImageDisplay