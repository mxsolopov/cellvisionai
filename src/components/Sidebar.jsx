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
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBreakpointValue,
} from "@chakra-ui/react"

const Sidebar = ({
  maskViewMode,
  setMaskViewMode,
  opacity,
  setOpacity,
  threshold,
  setThreshold,
  selectedModel,
  setSelectedModel,
  handleSubmit,
}) => {
  const [showOpacityTooltip, setShowOpacityTooltip] = React.useState(false)
  const [showThresholdTooltip, setShowThresholdTooltip] = React.useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true)

  const handleModelChange = (value) => {
    setSelectedModel(value)
    setIsButtonDisabled(false) // Enable button on radio change
  }

  const handleThresholdChange = (value) => {
    setThreshold(value)
    setIsButtonDisabled(false) // Enable button on slider change
  }

  // Determine if the view is mobile
  const isMobile = useBreakpointValue({ base: true, md: false })

  const viewModeContent = (
    <Box
      p={{ base: 0, md: 4 }}
      borderWidth={{ base: 0, md: 1 }}
      borderRadius="md"
    >
      <VStack align="start" spacing={4}>
        {!isMobile && <Heading size="md">Режим просмотра</Heading>}
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
  )

  const modelContent = (
    <Box
      p={{ base: 0, md: 4 }}
      borderWidth={{ base: 0, md: 1 }}
      borderRadius="md"
    >
      <VStack align="start" spacing={4}>
        {!isMobile && <Heading size="md">Модель сегментации</Heading>}
        <RadioGroup value={selectedModel} onChange={handleModelChange}>
          <VStack align="start">
            <Radio value="unet">U-Net</Radio>
            <Radio value="deeplab">DeepLab</Radio>
            <Radio value="segnet">SegNet</Radio>
            <Radio value="cellpose" isDisabled>
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
          onChange={(a) => handleThresholdChange(a)}
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
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isDisabled={isButtonDisabled}
        >
          Обновить маски
        </Button>
      </VStack>
    </Box>
  )

  return isMobile ? (
    <Accordion defaultIndex={[0]} allowToggle marginTop={4}>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left" fontWeight="bold">
            Режим просмотра
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>{viewModeContent}</AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left" fontWeight="bold">
            Модель сегментации
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>{modelContent}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  ) : (
    <Flex w="25%" direction="column" gap="4">
      {viewModeContent}
      {modelContent}
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
  selectedModel: PropTypes.string.isRequired,
  setSelectedModel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
}

export default Sidebar
