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
  const [masks, setMasks] = React.useState([])
  const [maskViewMode, setMaskViewMode] = React.useState("1")
  const [opacity, setOpacity] = React.useState(0.2)

  const URL = "http://127.0.0.1:5000"

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    setIsUploading(true);
  
    const promises = [];
  
    const addFileWithDelay = async (index) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const formData = new FormData();
      formData.append("images", images[index]);
  
      const promise = fetch(`${URL}/upload-cv`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.mask_base64) {
            console.log("File uploaded successfully:", data.mask_base64);
            setMasks((prevMasks) => [...prevMasks, data.mask_base64]);
          } else {
            console.error("File upload failed:", data.error);
          }
        })
        .catch((error) => {
          console.error("File upload failed:", error);
        });
  
      promises.push(promise);
    };
  
    for (let i = 0; i < images.length; i++) {
      await addFileWithDelay(i);
    }
  
    Promise.all(promises).then(() => {
      setIsUploaded(true);
      setIsUploading(false);
    });
  };

  return (
    <>
      {isUploading ? (
        <LoadingScreen />
      ) : isUploaded ? (
        <Box p={4}>
          <Header isUploaded={isUploaded} />
          <Flex mt={4}>
            <Sidebar maskViewMode={maskViewMode} setMaskViewMode={setMaskViewMode} opacity={opacity} setOpacity={setOpacity} />
            <ImageDisplay images={images} masks={masks} maskViewMode={maskViewMode} opacity={opacity} />
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
