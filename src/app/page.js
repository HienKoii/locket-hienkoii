"use client";

import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import Header from "@/components/Header";
import Upload from "@/components/Upload";

export default function Home() {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Box minH="100vh" bg={bgColor}>
      <Header />
      <Container maxW="2xl" pt={2}>
        <Upload />
      </Container>
    </Box>
  );
}
