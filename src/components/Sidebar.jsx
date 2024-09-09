import React from "react"
import PropTypes from "prop-types"
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
  Tooltip,
  VStack,
  HStack,
  Flex,
} from "@chakra-ui/react"

const Sidebar = ({
  maskViewMode,
  setMaskViewMode,
  opacity,
  setOpacity,
  threshold,
  setThreshold,
}) => {
  const [showOpacityTooltip, setShowOpacityTooltip] = React.useState(false)
  const [showThresholdTooltip, setShowThresholdTooltip] = React.useState(false)

  return (
    <Flex w="25%" direction="column" gap="4">
      <Box p={4} borderWidth={1} borderRadius="md">
        <VStack align="start" spacing={4}>
          <Heading size="md">Режим просмотра</Heading>
          <RadioGroup value={maskViewMode} onChange={setMaskViewMode}>
            <VStack align="start">
              <Radio value="1">Показать маску</Radio>
              <Radio value="2">Без маски</Radio>
              <Radio value="3">Наложить маску</Radio>
            </VStack>
          </RadioGroup>
          {maskViewMode == "3" && (
            <Slider
              defaultValue={opacity}
              min={0}
              max={1}
              step={0.1}
              colorScheme="teal"
              onChange={(v) => setOpacity(v)}
              onMouseEnter={() => setShowOpacityTooltip(true)}
              onMouseLeave={() => setShowOpacityTooltip(false)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="teal.500"
                color="white"
                placement="top"
                isOpen={showOpacityTooltip}
                label={`${opacity}`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>
          )}
        </VStack>
      </Box>
      <Box p={4} borderWidth={1} borderRadius="md">
        <VStack align="start" spacing={4}>
          <Heading size="md">Модель сегментации</Heading>
          <RadioGroup defaultValue="1">
            <VStack align="start">
              <Radio value="1">U-Net</Radio>
              <Radio value="2">DeepLab</Radio>
              <Radio value="3">SegNet</Radio>
              <Radio value="4" isDisabled>
                Cellpose (скоро!)
              </Radio>
            </VStack>
          </RadioGroup>
          <Text>Порог классификации</Text>
          <Slider
            defaultValue={threshold}
            min={0}
            max={1}
            step={0.01}
            colorScheme="teal"
            onChange={(a) => setThreshold(a)}
            onMouseEnter={() => setShowThresholdTooltip(true)}
            onMouseLeave={() => setShowThresholdTooltip(false)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <Tooltip
              hasArrow
              bg="teal.500"
              color="white"
              placement="top"
              isOpen={showThresholdTooltip}
              label={`${threshold}`}
            >
              <SliderThumb />
            </Tooltip>
          </Slider>
          <Button colorScheme="blue">Обновить маски</Button>
        </VStack>
      </Box>
    </Flex>
  )
}

Sidebar.propTypes = {
  maskViewMode: PropTypes.string.isRequired,
  setMaskViewMode: PropTypes.func.isRequired,
  opacity: PropTypes.number.isRequired,
  setOpacity: PropTypes.func.isRequired,
  threshold: PropTypes.number.isRequired,
  setThreshold: PropTypes.func.isRequired,
}

export default Sidebar
