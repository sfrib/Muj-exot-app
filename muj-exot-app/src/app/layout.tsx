import './globals.css'
import React from 'react'

export const metadata = {
  title: 'Můj Exot — Digital Pass',
  description: 'Digital pass & husbandry for exotic pets',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <div className="container py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Můj Exot — Digital Pass</h1>
            <nav className="text-sm">
              <a className="mr-4 underline" href="/">Dashboard</a>
              <a className="mr-4 underline" href="/animals/new">Nové zvíře</a>
              <a className="underline" href="/vets">Mapa vetů (brzy)</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
