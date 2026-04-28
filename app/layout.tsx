import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { FirebaseProvider } from '@/components/providers/firebase-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Em Busca do One Piece',
  description: 'Jogo de RPG online baseado no universo de One Piece',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <FirebaseProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </FirebaseProvider>
      </body>
    </html>
  )
}
