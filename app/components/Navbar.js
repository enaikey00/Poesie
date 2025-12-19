'use client'

import Link from 'next/link'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const textColor = theme === 'dark' ? '#fff' : '#212529'

  return (
    <nav style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/" className="nes-btn">
            🏠 Home
          </Link>
          {user && (
            <>
              <Link href="/poesie" className="nes-btn" style={{ marginLeft: '1rem' }}>
                📜 Tutte
              </Link>
              <Link href="/mie-poesie" className="nes-btn" style={{ marginLeft: '1rem' }}>
                📚 Le mie poesie
              </Link>
              <Link href="/nuova" className="nes-btn is-success" style={{ marginLeft: '1rem' }}>
                ✍️ Scrivi
              </Link>
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleTheme} 
            className="nes-btn"
            title="Cambia tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          {user ? (
            <>
              <span style={{ color: textColor }}>
                Ciao, {user.user_metadata?.nome || user.email}!
              </span>
              <button onClick={handleSignOut} className="nes-btn is-error">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="nes-btn is-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}