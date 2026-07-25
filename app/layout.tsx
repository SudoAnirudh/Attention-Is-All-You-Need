import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Attention, Visualized — Interactive Explainer for Attention Is All You Need',
  description:
    'An interactive, step-by-step visual exploration of the Transformer architecture from Vaswani et al., 2017.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark font-sans">
      <body className="bg-tokyo-bg text-tokyo-text antialiased selection:bg-tokyo-purple/30 selection:text-tokyo-cyan min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
