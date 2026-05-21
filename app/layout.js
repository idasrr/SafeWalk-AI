import './globals.css'

export const metadata = {
  title: 'SafeWalk AI',
  description: 'Aplikasi keamanan perjalanan malam berbasis AI',
  themeColor: '#0a0f1a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-[#0a0f1a] text-white min-h-screen">
        <div className="max-w-md mx-auto min-h-screen relative overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
