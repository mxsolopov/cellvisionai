import React from "react"
import PropTypes from "prop-types"
import {
  Box,
  Button,
  Input,
  Image,
  Text,
  VStack,
  Heading,
  useColorMode,
} from "@chakra-ui/react"
import FileIcon from "../assets/fileicon.svg"
import Check from "../assets/check.svg"

const UploadBox = ({
  images,
  setImages,
  handleSubmit,
  isUploading,
  isUploaded,
}) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [isDragging, setIsDragging] = React.useState(false)

  // Обработчик изменения файла
  const handleFileChange = (event) => {
    const selectedFile = event.target.files
    setImages(selectedFile)
  }

  // Обработчик события `dragover`
  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  // Обработчик события `drop`
  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const droppedFiles = event.dataTransfer.files
    if (droppedFiles.length > 0) {
      setImages(droppedFiles)
    }
  }

  // Обработчик события `dragenter` и `dragleave` для визуальных эффектов
  const handleDragEnter = () => setIsDragging(true)
  const handleDragLeave = () => setIsDragging(false)

  return (
    <>
      <Heading mt={8} align="center">
        Cегментация микрофотографий клеточных культур
      </Heading>
      <Text align="center" color="gray.500" w="50%" mt={4} ml="auto" mr="auto">
        Сервис используется для сегментации фотографий ММСК, сделанных в режиме
        фазового контраста, на основе обученных нейросетевых моделей.
      </Text>
      <Box opacity={isUploaded ? "0.5" : "1"} mt={6}>
        <VStack
          align="center"
          justify="center"
          bg={
            isDragging
              ? colorMode == "dark"
                ? "rgba(50,50,50,0.2)"
                : "purple.200"
              : colorMode == "dark"
              ? "rgba(50,50,50,0.2)"
              : "purple.100"
          }
          border="2px dashed"
          borderColor="purple.800"
          borderRadius="md"
          p={4}
          textAlign="center"
          color="gray.600"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          height="280px"
          mt={4}
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="center">
              <Box>
                <Input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }} // Скрываем Input
                  id="file-upload"
                  disabled={isUploaded}
                  multiple
                  max={3}
                />
                <label htmlFor="file-upload">
                  <VStack>
                    <Image
                      src={images ? Check : FileIcon}
                      width="64px"
                      height="64px"
                      alt="File"
                    />
                    <Text color="gray.600">
                      {images ? (
                        `Добавлено ${images.length} файл(ов)`
                      ) : (
                        <>
                          Перетащите файлы сюда или{" "}
                          <Box
                            as="span"
                            textDecoration="underline"
                            fontWeight="bold"
                            cursor={!isUploaded ? "pointer" : "default"}
                          >
                            выберите файлы
                          </Box>
                        </>
                      )}
                    </Text>
                  </VStack>
                </label>
              </Box>
              {images ? (
                <Button
                  mx="auto"
                  width="100px"
                  type="submit"
                  colorScheme="teal"
                  display={isUploading ? "none" : "block"}
                >
                  Загрузить
                </Button>
              ) : (
                <></>
              )}
            </VStack>
          </form>
        </VStack>
        <Text
          mt="2"
          mx="auto"
          textAlign="center"
          fontSize="sm"
          color="gray.500"
        >
          Загрузите до 10 изображений размером 224x224 пикселя
        </Text>
      </Box>
    </>
  )
}

UploadBox.propTypes = {
  images: PropTypes.instanceOf(FileList),
  setImages: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  isUploaded: PropTypes.bool.isRequired,
}

export default UploadBox
