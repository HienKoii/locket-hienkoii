"use client";

import { Box, Container, HStack, Button, Avatar, Menu, MenuButton, MenuList, MenuItem, useDisclosure, Text, Flex, MenuDivider, useColorMode, Icon } from "@chakra-ui/react";
import { useAuth } from "@/context/AuthContext";
import LoginModal from "./LoginModal";
import { FiUser, FiSettings, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import Image from "next/image";

export default function Header() {
  const { user, logout } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as="header"
      position="fixed"
      top={0}
      left={0}
      right={0}
      width="100%"
      zIndex={1000}
      bg={colorMode === "light" ? "white" : "gray.800"}
      py={4}
      minH={"73px"}
      borderBottom="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
    >
      <Container maxW="container.xl">
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Image src="/logo.png" alt="Locket Logo" width={32} height={32} style={{ objectFit: "contain" }} />
            <Box fontWeight="bold" fontSize="xl" color="pink.500">
              Locket Uploader
            </Box>
          </HStack>
          {user ? (
            <Menu>
              <MenuButton>
                <Flex justifyContent={"center"} alignItems={"center"} gap={2}>
                  <Text>{user?.displayName} </Text>
                  <Avatar size="sm" name={user?.displayName} src={user?.profilePicture} />
                </Flex>
              </MenuButton>
              <MenuList py={2} minW="200px">
                <MenuItem icon={<Icon as={colorMode === "light" ? FiMoon : FiSun} />} onClick={toggleColorMode} _hover={{ bg: "pink.50" }}>
                  {colorMode === "light" ? "Chế độ tối" : "Chế độ sáng"}
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<FiLogOut />} onClick={logout} _hover={{ bg: "pink.50" }} color="red.500">
                  Đăng xuất
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button colorScheme="pink" size={"sm"} onClick={onOpen}>
              Đăng nhập
            </Button>
          )}
        </HStack>
      </Container>

      <LoginModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
