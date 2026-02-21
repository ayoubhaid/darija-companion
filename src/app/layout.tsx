import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Darija Companion - Learn Moroccan Arabic',
  description: 'A comprehensive Moroccan Darija learning app with interactive lessons, vocabulary flashcards, and quizzes.',
  keywords: ['Darija', 'Moroccan Arabic', 'Learn Arabic', 'Language Learning'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.31.2/dist/editorjs.min.css" 
          integrity="sha384-y7G1h1 vz7L+90tHA4a593S4V9C4j8b1gYfFfK6bA3kA3q3A3Y3y3y3y3" 
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
