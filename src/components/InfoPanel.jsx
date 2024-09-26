import React from "react"
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useBreakpointValue,
} from "@chakra-ui/react"
import PropTypes from "prop-types"
import JSZip from "jszip"
import { saveAs } from "file-saver"

const InfoPanel = ({
  imageData,
  executionTime,
  currentConfluency,
  totalConfluency
}) => {

  const downloadMasksAsZip = async () => {
    const zip = new JSZip()

    imageData.forEach((item, index) => {
      if (item.mask) {
        const byteCharacters = atob(item.mask)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)

        const originalName = item.file.name.split(".").slice(0, -1).join(".")
        const maskFileName = `${originalName}_mask.png`

        zip.file(maskFileName, byteArray)
      }
    })

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "masks.zip")
    })
  }

  const convertMaskToJson = (maskBase64) => {
    const img = new Image()
    img.src = `data:image/png;base64,${maskBase64}`

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, img.width, img.height)

        const src = cv.matFromImageData(imageData)
        const gray = new cv.Mat()
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0)

        const contours = new cv.MatVector()
        const hierarchy = new cv.Mat()
        cv.findContours(
          gray,
          contours,
          hierarchy,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE
        )

        const contoursData = []
        for (let i = 0; i < contours.size(); i++) {
          const contour = contours.get(i)
          const contourData = []
          for (let j = 0; j < contour.rows; j++) {
            contourData.push({
              x: contour.intAt(j, 0),
              y: contour.intAt(j, 1),
            })
          }
          contoursData.push(contourData)
        }

        src.delete()
        gray.delete()
        contours.delete()
        hierarchy.delete()

        resolve(JSON.stringify(contoursData, null, 4))
      }
    })
  }

  const downloadMasksAsJsonZip = async () => {
    const zip = new JSZip()

    for (let index = 0; index < imageData.length; index++) {
      if (imageData[index].mask) {
        const jsonContent = await convertMaskToJson(imageData[index].mask)

        const originalName = imageData[index].file.name
          .split(".")
          .slice(0, -1)
          .join(".")
        const jsonFileName = `${originalName}_mask.json`

        zip.file(jsonFileName, jsonContent)
      }
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "masks_json.zip")
    })
  }

  const isMobile = useBreakpointValue({ base: true, md: false })

  const infoContent = (
    <Box
      p={{ base: 0, md: 4 }}
      borderWidth={{ base: 0, md: 1 }}
      borderRadius="md"
    >
      <VStack align="start" spacing={4}>
        {!isMobile && <Heading size="md">Информация</Heading>}
        <Text>Текущая конфлуэнтность - {currentConfluency}%</Text>
        <Text>Общая конфлуэнтность - {totalConfluency}%</Text>
        <Text>Время обработки - {executionTime} сек</Text>
      </VStack>
    </Box>
  )

  const maskContent = (
    <Box
      p={{ base: 0, md: 4 }}
      borderWidth={{ base: 0, md: 1 }}
      borderRadius="md"
    >
      <VStack align="start" spacing={4}>
        {!isMobile && <Heading size="md">Выходные файлы</Heading>}
        <Text>Скачать все маски</Text>
        <HStack>
          <Button onClick={downloadMasksAsZip}>PNG</Button>
          <Button onClick={downloadMasksAsJsonZip}>JSON</Button>
        </HStack>
      </VStack>
    </Box>
  )

  return isMobile ? (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left" fontWeight="bold">
            Информация
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>{infoContent}</AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left" fontWeight="bold">
            Выходные файлы
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>{maskContent}</AccordionPanel>
      </AccordionItem>
    </Accordion>
  ) : (
    <Flex w="25%" direction="column" gap="4">
      {infoContent}
      {maskContent}
    </Flex>
  )
}

InfoPanel.propTypes = {
  imageData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      file: PropTypes.instanceOf(File).isRequired,
      mask: PropTypes.string,
    })
  ).isRequired,
  executionTime: PropTypes.string.isRequired,
  currentConfluency: PropTypes.string.isRequired,
  totalConfluency: PropTypes.string.isRequired,
}

export default InfoPanel
