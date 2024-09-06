import React from "react"
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
  Text
} from "@chakra-ui/react"
import ImageTemplate from "./assets/cells.png"

const ImageDisplay = () => {
  return (
    <Flex w="50%" direction="column" align="center" gap={4}>
      <HStack>
        <Button size="sm">Назад</Button>
        <Text>1 из 20</Text>
        <Button size="sm">Далее</Button>
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
      <Image w="500px" src={ImageTemplate} alt="Image" />
    </Flex>
  )
}

export default ImageDisplay
