import { Box, Image, Text, Flex } from "@chakra-ui/react";

const PreviewWithCaption = ({ preview, caption, topColor, bottomColor, textColor, selectedBadge }) => {
  if (!preview) return null;

  const badgeImages = {
    gold: "/badges/gold.png",
    celebrity: "/badges/celebrity.png",
    locketapp: "/badges/locketapp.png",
  };

  return (
    <Box position="relative" width="100%" maxH="300px">
      <Image src={preview} maxH="300px" borderRadius="lg" objectFit="cover" width="100%" />
      {caption && (
        <Box position="absolute" bottom={0} left={0} right={0} p={4} background={`linear-gradient(to bottom, ${topColor || "rgba(0,0,0,0)"}, ${bottomColor || "rgba(0,0,0,0.5)"})`} borderBottomRadius="lg">
          <Flex align="center" justify="center" gap={2}>
            {selectedBadge && badgeImages[selectedBadge] && <Image src={badgeImages[selectedBadge]} alt="Badge" height="20px" objectFit="contain" />}
            <Text color={textColor || "white"} fontSize="sm" fontWeight="medium" textAlign="center">
              {caption}
            </Text>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default PreviewWithCaption;
