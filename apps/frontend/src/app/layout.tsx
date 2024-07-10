import '@/styles/globals.css'

import { siteConfig } from '@/config/site'
import { figtree } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { SiteHeader } from '@/components/site-header'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: siteConfig.title,
  openGraph: {
    title: siteConfig.title,
    siteName: siteConfig.title,
    images: '/opengraph-image.png',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: './opengraph-image.png',
        alt: siteConfig.title,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          figtree.variable,
        )}
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
