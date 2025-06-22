import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Communal Admin - Système d\'administration',
  description: 'Interface d\'administration pour la gestion de contenu communal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sofia antialiased">
        {children}
      </body>
    </html>
  );
}