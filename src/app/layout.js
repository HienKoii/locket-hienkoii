import { Inter } from "next/font/google";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Providers from "./providers";
import { Box } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Locket Uploader",
  description: "Upload your moments to Locket by HienKoii",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <Box pt="72px">
              {children}
            </Box>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
