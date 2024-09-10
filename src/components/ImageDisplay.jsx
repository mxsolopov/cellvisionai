import React from "react"
import PropTypes from "prop-types"
import { Flex, Button, Image, HStack, Text, Box } from "@chakra-ui/react"

const ImageDisplay = ({ images, masks, opacity, maskViewMode, currentIndex, setCurrentIndex }) => {
  const [imagesURLs, setImagesURLs] = React.useState([])

  React.useEffect(() => {
    const files = Array.from(images)
    const urls = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        urls.push(reader.result)
        if (urls.length === files.length) {
          setImagesURLs(urls)
        }
      }
      reader.readAsDataURL(file)
    })
  }, [images])

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  return (
    <Flex w="50%" direction="column" align="center" gap={4}>
      <Box position="relative" w="500px" h="500px" overflow="hidden">
        {imagesURLs.length > 0 && (
          <Image
            w="500px"
            src={imagesURLs[currentIndex]}
            alt="Original Image"
            position="absolute"
            top="0"
            left="0"
            zIndex="1"
          />
        )}
        {masks.length > 0 && (
          <Image
            w="500px"
            src={`data:image/png;base64,${masks[currentIndex]}`}
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
        <Button size="sm" onClick={handlePrev} disabled={images.length === 0}>
          Назад
        </Button>
        <Text>
          {images.length > 0
            ? `${currentIndex + 1} из ${images.length}`
            : "Нет изображений"}
        </Text>
        <Button size="sm" onClick={handleNext} disabled={images.length === 0}>
          Далее
        </Button>
      </HStack>
    </Flex>
  )
}

ImageDisplay.propTypes = {
  images: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  masks: PropTypes.arrayOf(PropTypes.string).isRequired,
  opacity: PropTypes.number.isRequired,
  maskViewMode: PropTypes.string.isRequired,
  currentIndex: PropTypes.number.isRequired,
  setCurrentIndex: PropTypes.func.isRequired,
}

export default ImageDisplay