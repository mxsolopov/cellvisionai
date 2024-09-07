import React from "react"
import { Box, Flex } from "@chakra-ui/react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import ImageDisplay from "./components/ImageDisplay"
import InfoPanel from "./components/InfoPanel"
import UploadBox from "./components/UploadBox"
import LoadingScreen from "./components/LoadingScreen"

const App = () => {
  const [images, setImages] = React.useState(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isUploaded, setIsUploaded] = React.useState(false)
  const [uploadedImages, setUploadedImages] = React.useState([])

  const URL = "http://127.0.0.1:5000"

  const handleSubmit = async (event) => {
    event.preventDefault() // Предотвращает перезагрузку страницы при отправке формы

    setIsUploading(true)

    const promises = []

    // Функция для добавления файла с задержкой
    const addFileWithDelay = async (index) => {
      await new Promise((resolve) => setTimeout(resolve, 3000)) // Ожидание задержки
      const formData = new FormData()
      formData.append("images", images[index])

      const promise = fetch(`${URL}/upload-cv`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Если загрузка прошла успешно, обновляем состояние uploadedImages
          if (data.file_path) {
            console.log("File uploaded successfully:", data.file_path)
            setUploadedImages((prevFilePath) => [...prevFilePath, data.file_path])
          } else {
            console.error("File upload failed:", data.error)
          }
        })
        .catch((error) => {
          console.error("File upload failed:", error)
        })

      promises.push(promise)
    }

    // Асинхронный цикл для добавления файлов с задержкой
    for (let i = 0; i < images.length; i++) {
      await addFileWithDelay(i)
    }

    // После завершения всех асинхронных операций выполняем следующие действия
    Promise.all(promises).then(() => {
      setIsUploaded(true)
      setIsUploading(false)
      // setImages(null)
    })
  }

  return (
    <>
      {isUploading ? (
        <LoadingScreen />
      ) : isUploaded ? (
        <Box p={4}>
          <Header isUploaded={isUploaded} />
          <Flex mt={4}>
            <Sidebar />
            <ImageDisplay uploadedImages={uploadedImages} />
            <InfoPanel />
          </Flex>
        </Box>
      ) : (
        <Box p={4}>
          <Header isUploaded={isUploaded} />
          <UploadBox
            images={images}
            setImages={setImages}
            handleSubmit={handleSubmit}
            isUploading={isUploading}
            isUploaded={isUploaded}
          />
        </Box>
      )}
    </>
  )
}

export default App
