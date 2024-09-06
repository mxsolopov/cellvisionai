import React from "react"
import {
    Box,
    RadioGroup,
    Radio,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Image,
    HStack,
  } from '@chakra-ui/react';

const ImageDisplay = () => {
  return (
    <Box w="60%" p={4}>
      <Image src="image_placeholder.png" alt="Image" />
      <HStack justify="center" mt={4}>
        <RadioGroup defaultValue="1">
          <HStack spacing={4}>
            <Radio value="1">Без маски</Radio>
            <Radio value="2">Показать маску</Radio>
            <Radio value="3">Наложить маску</Radio>
          </HStack>
        </RadioGroup>
        <Slider defaultValue={0.5} min={0} max={1} step={0.1} w="40%">
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </HStack>
    </Box>
  )
}

export default ImageDisplay