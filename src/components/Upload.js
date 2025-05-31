import { useState, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Textarea,
  Select,
  useToast,
  Container,
  Heading,
  Text,
  Flex,
  Image,
  useColorModeValue,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  HStack,
  RadioGroup,
  Radio,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import ColorPicker from "./ColorPicker";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Upload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({
    unit: 'px',
    width: 400,
    height: 400,
    x: 0,
    y: 0
  });
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef(null);
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [formData, setFormData] = useState({
    caption: "",
    topColor: "",
    bottomColor: "",
    textColor: "",
    captionType: "static_content",
    selectedBadge: "",
    visibleTo: "",
  });

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);

    // Create preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);

    // Nếu là ảnh, hiển thị modal cắt ảnh
    if (selectedFile.type.includes("image")) {
      setShowCropModal(true);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "video/*": [".mp4", ".mov"],
    },
    maxSize: 10485760, // 10MB
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "selectedBadge" && value ? { captionType: "static_content" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đăng nhập để tải lên",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!file) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file để tải lên",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    const uploadData = new FormData();

    // Thêm user data
    const userData = {
      localId: user.localId,
      idToken: user.idToken,
    };
    uploadData.append("user", JSON.stringify(userData));
    // Thêm file
    uploadData.append("file", file);

    // Thêm các trường khác
    uploadData.append("caption", formData.caption || "");
    uploadData.append("topColor", formData.topColor || "");
    uploadData.append("bottomColor", formData.bottomColor || "");
    uploadData.append("textColor", formData.textColor || "");
    uploadData.append("captionType", formData.captionType || "");
    uploadData.append("selectedBadge", formData.selectedBadge || "");
    uploadData.append("visibleTo", formData.visibleTo || "");

    try {
      const response = await axios.post("/api/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log("Upload progress:", percentCompleted);
        },
      });

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      toast({
        title: "Thành công",
        description: "Tải lên file thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Reset form
      setFile(null);
      setPreview(null);
      setFormData({
        caption: "",
        topColor: "",
        bottomColor: "",
        textColor: "",
        captionType: "",
        selectedBadge: "",
        visibleTo: "",
      });
    } catch (error) {
      console.error("Upload error:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể tải lên file",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const onCropComplete = (crop, pixelCrop) => {
    if (imgRef.current && crop.width && crop.height) {
      const canvas = document.createElement("canvas");
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      // Sử dụng kích thước thực của ảnh
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");

      // Thêm các thuộc tính để cải thiện chất lượng
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        imgRef.current,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        400,
        400
      );

      // Chuyển đổi canvas thành blob với chất lượng cao
      canvas.toBlob(
        (blob) => {
          const croppedImageUrl = URL.createObjectURL(blob);
          setCroppedImage(croppedImageUrl);
          setPreview(croppedImageUrl);

          // Tạo file mới từ blob với chất lượng cao
          const croppedFile = new File([blob], file.name, { 
            type: file.type,
            lastModified: new Date().getTime()
          });
          setFile(croppedFile);
        },
        file.type,
        1.0 // Chất lượng tối đa (1.0 = 100%)
      );
    }
  };

  const handleCropClose = () => {
    setShowCropModal(false);
    setCrop(undefined);
  };

  const handleCropSave = () => {
    if (crop) {
      onCropComplete(crop);
    }
    setShowCropModal(false);
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg" textAlign="center" color="pink.500" fontFamily="cursive">
          Tải Lên Locket
        </Heading>

        <Box
          {...getRootProps()}
          p={10}
          border="2px dashed"
          borderColor={isDragActive ? "pink.400" : borderColor}
          borderRadius="xl"
          bg={bgColor}
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ borderColor: "pink.400", transform: "scale(1.02)" }}
          boxShadow="sm"
        >
          <input {...getInputProps()} />
          <Flex direction="column" align="center" justify="center" gap={4}>
            {preview ? (
              file.type.includes("image") ? (
                <Image src={preview} maxH="300px" borderRadius="lg" objectFit="cover" />
              ) : (
                <video
                  src={preview}
                  controls
                  style={{
                    maxHeight: "300px",
                    borderRadius: "8px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />
              )
            ) : (
              <>
                <Icon as={FiUpload} w={10} h={10} color="pink.500" />
                <Text color="gray.500" textAlign="center">
                  {isDragActive ? "Thả file vào đây" : "Kéo thả file vào đây hoặc click để chọn"}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Hỗ trợ: Ảnh (PNG, JPG) hoặc Video (MP4, MOV)
                </Text>
              </>
            )}
          </Flex>
        </Box>

        {/* Modal cắt ảnh */}
        <Modal isOpen={showCropModal} onClose={handleCropClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cắt ảnh</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {preview && (
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  aspect={1}
                  minWidth={400}
                  minHeight={400}
                  maxWidth={400}
                  maxHeight={400}
                  locked={true}
                >
                  <img 
                    ref={imgRef} 
                    src={preview} 
                    alt="Preview" 
                    style={{ 
                      maxWidth: "100%", 
                      maxHeight: "70vh",
                      objectFit: "contain"
                    }} 
                  />
                </ReactCrop>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleCropSave}>
                Lưu
              </Button>
              <Button variant="ghost" onClick={handleCropClose}>
                Hủy
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl>
              <Textarea
                name="caption"
                value={formData.caption}
                onChange={handleInputChange}
                placeholder="Nhập caption của bạn..."
                borderRadius="lg"
                _focus={{ borderColor: "pink.400", boxShadow: "0 0 0 1px var(--chakra-colors-pink-400)" }}
              />
            </FormControl>

            <FormControl>
              <HStack spacing={4} align="center">
                <FormLabel mb={0} minW="100px">
                  Màu trên:
                </FormLabel>
                <Popover placement="bottom">
                  <PopoverTrigger>
                    <Button
                      w="100%"
                      h="40px"
                      bg={formData.topColor || "gray.100"} //
                      _hover={{ opacity: 0.8 }}
                      borderRadius="full"
                      border="1px solid"
                      borderColor="gray.200"
                    />
                  </PopoverTrigger>
                  <PopoverContent width="auto">
                    <PopoverBody p={0}>
                      <ColorPicker color={formData.topColor} onChange={(color) => handleInputChange({ target: { name: "topColor", value: color.hex } })} />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </HStack>
            </FormControl>

            <FormControl>
              <HStack spacing={4} align="center">
                <FormLabel mb={0} minW="100px">
                  Màu dưới:
                </FormLabel>
                <Popover placement="bottom">
                  <PopoverTrigger>
                    <Button w="100%" h="40px" bg={formData.bottomColor || "gray.100"} _hover={{ opacity: 0.8 }} borderRadius="full" border="1px solid" borderColor="gray.200" />
                  </PopoverTrigger>
                  <PopoverContent width="auto">
                    <PopoverBody p={0}>
                      <ColorPicker color={formData.bottomColor} onChange={(color) => handleInputChange({ target: { name: "bottomColor", value: color.hex } })} />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </HStack>
            </FormControl>

            <FormControl>
              <HStack spacing={4} align="center">
                <FormLabel mb={0} minW="100px">
                  Màu chữ:
                </FormLabel>
                <Popover placement="bottom">
                  <PopoverTrigger>
                    <Button w="100%" h="40px" bg={formData.textColor || "gray.100"} _hover={{ opacity: 0.8 }} borderRadius="full" border="1px solid" borderColor="gray.200" />
                  </PopoverTrigger>
                  <PopoverContent width="auto">
                    <PopoverBody p={0}>
                      <ColorPicker color={formData.textColor} onChange={(color) => handleInputChange({ target: { name: "textColor", value: color.hex } })} />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </HStack>
            </FormControl>

            {/* <FormControl>
              <FormLabel mb={0} minW="100px">
                Loại caption:
              </FormLabel>
              <RadioGroup name="captionType" value={formData.captionType} onChange={(value) => handleInputChange({ target: { name: "captionType", value } })}>
                <Stack direction="row" spacing={4}>
                  <Radio value="default" colorScheme="pink">
                    Mặc định
                  </Radio>
                  <Radio value="centered" colorScheme="pink">
                    Căn giữa
                  </Radio>
                  <Radio value="bottom" colorScheme="pink">
                    Dưới cùng
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl> */}

            <FormControl>
              <FormLabel mb={0} minW="100px">
                Chọn huy hiệu caption:
              </FormLabel>
              <RadioGroup name="selectedBadge" value={formData.selectedBadge} onChange={(value) => handleInputChange({ target: { name: "selectedBadge", value } })}>
                <Stack direction="row" spacing={4}>
                  <Radio value="gold" colorScheme="pink">
                    LocketGold
                  </Radio>
                  <Radio value="celebrity" colorScheme="pink">
                    Celebrity
                  </Radio>
                  <Radio value="locketapp" colorScheme="pink">
                    IconLocket
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <Button type="submit" colorScheme="pink" size="lg" width="full" isLoading={loading} loadingText="Đang tải lên..." borderRadius="full" mt={4} _hover={{ transform: "scale(1.02)" }} transition="all 0.2s">
              Tải lên
            </Button>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default Upload;
