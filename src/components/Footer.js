"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Box, Container, Stack, Text, Heading, Flex, Grid, GridItem, Divider, useColorModeValue, Link as ChakraLink, useColorMode } from "@chakra-ui/react";

const Footer = () => {
  const textColor = useColorModeValue("gray.600", "gray.300");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
  const [currentYear, setCurrentYear] = useState("2024");
  const { colorMode } = useColorMode();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <Box
      as="footer"
      bg={colorMode === "light" ? "white" : "gray.800"}
      borderTop="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
      py={8}
    >
      <Container maxW="container.xl" px={4}>
        <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={8}>
          {/* Company Info */}
          <GridItem>
            <Stack spacing={4}>
              <Heading size="md" color="pink.500">
                Locket Uploader
              </Heading>
              <Text color={secondaryTextColor}>Tải lên và chia sẻ những khoảnh khắc đáng nhớ của bạn. Tạo những chiếc locket số đẹp mắt một cách dễ dàng.</Text>
            </Stack>
          </GridItem>

          {/* Quick Links */}
          <GridItem>
            <Stack spacing={4}>
              <Heading size="md" color="pink.500">
                Liên Kết Nhanh
              </Heading>
              <Stack spacing={2}>
                <Link href="/" passHref>
                  <Text color={secondaryTextColor} _hover={{ color: "pink.500" }} transition="color 0.2s" cursor="pointer">
                    Trang Chủ
                  </Text>
                </Link>
                <Link href="/upload" passHref>
                  <Text color={secondaryTextColor} _hover={{ color: "pink.500" }} transition="color 0.2s" cursor="pointer">
                    Tải Lên
                  </Text>
                </Link>
                <Link href="/gallery" passHref>
                  <Text color={secondaryTextColor} _hover={{ color: "pink.500" }} transition="color 0.2s" cursor="pointer">
                    Thư Viện
                  </Text>
                </Link>
              </Stack>
            </Stack>
          </GridItem>

          {/* Contact Info */}
          <GridItem>
            <Stack spacing={4}>
              <Heading size="md" color="pink.500">
                Liên Hệ
              </Heading>
              <Stack spacing={2} color={secondaryTextColor}>
                <Text>Email: khien1892002@gmail.com</Text>
              </Stack>
            </Stack>
          </GridItem>
        </Grid>

        <Divider borderColor={colorMode === "light" ? "gray.200" : "gray.700"} my={8} />
        <Flex direction="column" align="center" gap={2}>
          <Text color={secondaryTextColor}>&copy; {currentYear} Locket Uploader. Bảo lưu mọi quyền.</Text>
          <Text color={secondaryTextColor} fontSize="sm">
            Được phát triển bởi{" "}
            <ChakraLink href="https://www.facebook.com/hienkoii189" isExternal color="pink.500" _hover={{ textDecoration: "underline" }}>
              HienKoii
            </ChakraLink>
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
