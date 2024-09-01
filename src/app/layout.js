import "./globals.css";

export const metadata = {
  title: "Directives generator",
  description: "Application for generation daily directives",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
