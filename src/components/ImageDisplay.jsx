import React from "react"
import PropTypes from "prop-types"
import {
  Flex,
  Button,
  RadioGroup,
  Radio,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Image,
  HStack,
  Text,
} from "@chakra-ui/react"

const ImageDisplay = ({ uploadedImages }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % uploadedImages.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1
    )
  }

  return (
    <Flex w="50%" direction="column" align="center" gap={4}>
      <HStack>
        <Button size="sm" onClick={handlePrev} disabled={uploadedImages.length === 0}>
          Назад
        </Button>
        <Text>
          {uploadedImages.length > 0
            ? `${currentIndex + 1} из ${uploadedImages.length}`
            : "Нет изображений"}
        </Text>
        <Button size="sm" onClick={handleNext} disabled={uploadedImages.length === 0}>
          Далее
        </Button>
      </HStack>
      <HStack justify="center" w="100%">
        <RadioGroup defaultValue="1">
          <HStack spacing={4}>
            <Radio value="1">Без маски</Radio>
            <Radio value="2">Показать маску</Radio>
            <Radio value="3">Наложить маску</Radio>
          </HStack>
        </RadioGroup>
        <Slider defaultValue={0.5} min={0} max={1} step={0.1} w="20%">
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </HStack>
      {uploadedImages.length > 0 && (
        // <Image w="500px" src={uploadedImages[currentIndex]} alt="Image" />
        uploadedImages[currentIndex]
      )}
    </Flex>
  )
}

ImageDisplay.propTypes = {
  uploadedImages: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default ImageDisplay
