export const metadata = {
  title: "POC Livres personnalisés",
  description: "Upload et pages statiques"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
