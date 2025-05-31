import { AuthProvider } from "@/context/AuthContext";
import "../styles/globals.css";
import Providers from "./providers";
import Header from "@/components/Header";

export const metadata = {
  title: "Locket Uploader",
  description: "Upload your moments to Locket by HienKoii",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <Header />
            <>{children}</>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
