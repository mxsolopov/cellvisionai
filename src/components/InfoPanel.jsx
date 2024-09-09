import React from "react"
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
} from "@chakra-ui/react"
import PropTypes from "prop-types"
import JSZip from "jszip"
import { saveAs } from "file-saver"

const InfoPanel = ({ images, masks }) => {
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

  return (
    <Flex w="25%" direction="column" gap="4">
      <Box p={4} borderWidth={1} borderRadius="md">
        <VStack align="start" spacing={4}>
          <Heading size="md">Информация</Heading>
          <Text>Текущая конфлуэнтность - 45%</Text>
          <Text>Общая конфлуэнтность - 45%</Text>
          <Text>Время обработки - 45 сек</Text>
        </VStack>
      </Box>
      <Box p={4} borderWidth={1} borderRadius="md">
        <VStack align="start" spacing={4}>
          <Heading size="md">Выходные файлы</Heading>
          <Text>Скачать все маски</Text>
          <HStack>
            <Button onClick={downloadMasksAsZip}>PNG</Button>
            <Button onClick={downloadMasksAsJsonZip}>JSON</Button>
          </HStack>
        </VStack>
      </Box>
    </Flex>
  )
}

InfoPanel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  masks: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default InfoPanel
