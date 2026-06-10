import "./globals.css";

export const metadata = {
  title: "Toast Orders",
  description: "Cashier and kitchen order system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
