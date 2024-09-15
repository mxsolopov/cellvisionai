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
  images,
  masks,
  executionTime,
  currentConfluency,
  calculateConfluency,
}) => {
  const calculateTotalConfluency = async () => {
    const confluencies = await Promise.all(masks.map(calculateConfluency))
    const totalConfluency = (
      confluencies.reduce((acc, val) => acc + parseFloat(val), 0) /
      confluencies.length
    ).toFixed(2)
    return totalConfluency
  }

  const [totalConfluency, setTotalConfluency] = React.useState(0)

  React.useEffect(() => {
    if (masks.length > 0) {
      calculateTotalConfluency().then(setTotalConfluency)
    }
  }, [masks])

  const downloadMasksAsZip = async () => {
    const zip = new JSZip()

    masks.forEach((mask, index) => {
      const byteCharacters = atob(mask)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)

      // Get the original file name without extension
      const originalName = images[index].name.split(".").slice(0, -1).join(".")
      const maskFileName = `${originalName}_mask.png`

      zip.file(maskFileName, byteArray)
    })

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "masks.zip")
    })
  }

  const convertMaskToJson = (maskBase64) => {
    // Создаем элемент изображения
    const img = new Image()
    img.src = `data:image/png;base64,${maskBase64}`

    return new Promise((resolve) => {
      img.onload = () => {
        // Создаем canvas для обработки изображения
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx.drawImage(img, 0, 0)

        // Получаем данные изображения
        const imageData = ctx.getImageData(0, 0, img.width, img.height)

        // Инициализируем матрицу OpenCV
        const src = cv.matFromImageData(imageData)
        const gray = new cv.Mat()
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0)

        // Находим контуры
        const contours = new cv.MatVector()
        const hierarchy = new cv.Mat()
        cv.findContours(
          gray,
          contours,
          hierarchy,
          cv.RETR_EXTERNAL,
          cv.CHAIN_APPROX_SIMPLE
        )

        // Преобразуем контуры в формат JSON
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

        // Освобождаем ресурсы
        src.delete()
        gray.delete()
        contours.delete()
        hierarchy.delete()

        // Возвращаем JSON
        resolve(JSON.stringify(contoursData, null, 4))
      }
    })
  }

  const downloadMasksAsJsonZip = async () => {
    const zip = new JSZip()

    for (let index = 0; index < masks.length; index++) {
      const jsonContent = await convertMaskToJson(masks[index])

      // Get the original file name without extension
      const originalName = images[index].name.split(".").slice(0, -1).join(".")
      const jsonFileName = `${originalName}_mask.json`

      zip.file(jsonFileName, jsonContent)
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "masks_json.zip")
    })
  }

  // Determine if the view is mobile
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
  images: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  masks: PropTypes.arrayOf(PropTypes.string).isRequired,
  executionTime: PropTypes.number.isRequired,
  currentConfluency: PropTypes.string.isRequired,
  calculateConfluency: PropTypes.func.isRequired,
}

export default InfoPanel
