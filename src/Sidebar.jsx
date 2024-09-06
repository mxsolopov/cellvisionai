import React from "react"
import {
  Box,
  Heading,
  Text,
  Button,
  RadioGroup,
  Radio,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
} from "@chakra-ui/react"

const Sidebar = () => {
  return (
    <Box w="20%" p={4} borderWidth={1} borderRadius="md">
      <VStack align="start" spacing={4}>
        <Heading size="md">Модель сегментации</Heading>
        <RadioGroup defaultValue="1">
          <VStack align="start">
            <Radio value="1">DeepLab</Radio>
            <Radio value="2">SegNet</Radio>
            <Radio value="3">U-Net</Radio>
            <Radio value="4" isDisabled>
              Cellpose (скоро!)
            </Radio>
          </VStack>
        </RadioGroup>
        <Text>Порог</Text>
        <Slider defaultValue={0.5} min={0} max={1} step={0.1}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Heading size="md">Коррекция изображения</Heading>
        <Text>Яркость</Text>
        <Slider defaultValue={0.5} min={0} max={1} step={0.1}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Text>Контрастность</Text>
        <Slider defaultValue={0.5} min={0} max={1} step={0.1}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Text>Насыщенность</Text>
        <Slider defaultValue={0.5} min={0} max={1} step={0.1}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
        <Button colorScheme="blue">Обновить</Button>
        <Button>Обновить для всех</Button>
      </VStack>
    </Box>
  )
}

export default Sidebar