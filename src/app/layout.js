import SessionWrapper from "@/components/public/SessionWrapper";
import "./globals.css";

export const metadata = {
  title: "Ram Prasad Sapkota (Dipsikha) | Bhaktapur-2 | Nepali Communist Party",
  description: "Official campaign website of Ram Prasad Sapkota...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
