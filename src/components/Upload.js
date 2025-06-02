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
} from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import ColorPicker from "./ColorPicker";
import PreviewWithCaption from "./PreviewWithCaption";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const Upload = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
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
                <PreviewWithCaption preview={preview} caption={formData.caption} topColor={formData.topColor} bottomColor={formData.bottomColor} textColor={formData.textColor} selectedBadge={formData.selectedBadge} />
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
                    <Button w="100%" h="40px" bg={formData.topColor || "gray.100"} _hover={{ opacity: 0.8 }} borderRadius="full" border="1px solid" borderColor="gray.200" />
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
