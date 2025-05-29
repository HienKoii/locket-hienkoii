"use client";

import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button, VStack, Text, useToast, InputGroup, InputRightElement, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast({
        title: "Đăng nhập thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Đăng nhập thất bại",
        description: result.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent borderRadius="2xl" p={6}>
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          Đăng Nhập
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email của bạn" size="lg" borderRadius="xl" bg="gray.50" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Mật khẩu</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu" size="lg" borderRadius="xl" bg="gray.50" />
                  <InputRightElement h="full">
                    <IconButton variant="ghost" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} icon={showPassword ? <ViewOffIcon /> : <ViewIcon />} onClick={() => setShowPassword(!showPassword)} />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="pink"
                w="full"
                size="lg"
                isLoading={isLoading}
                borderRadius="full"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "lg",
                }}
                transition="all 0.2s"
                mt={4}
              >
                Đăng Nhập
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
