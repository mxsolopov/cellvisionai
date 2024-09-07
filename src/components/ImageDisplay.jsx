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

const ImageDisplay = ({ images }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [imagesURLs, setImagesURLs] = React.useState([])

  React.useEffect(() => {
    const files = Array.from(images);
    const urls = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        urls.push(reader.result);
        if (urls.length === files.length) {
          setImagesURLs(urls);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images]);

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
      {imagesURLs.length > 0 && (
        <Image w="500px" src={imagesURLs[currentIndex]} alt="Image" />
      )}
    </Flex>
  )
}

ImageDisplay.propTypes = {
  images: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
}

export default ImageDisplay