import 'nes.css/css/nes.min.css';
import './globals.css';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import Navbar from './components/Navbar';
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'Poesie in condivisione',
  description: 'Un sito per condividere poesie.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <div className="container">
              <Navbar />
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}