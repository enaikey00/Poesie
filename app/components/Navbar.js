'use client'

import Link from 'next/link'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
    router.push('/')
  }

  const textColor = theme === 'dark' ? '#fff' : '#212529'

  return (
    <nav style={{ marginBottom: '2rem' }}>
      {/* Navbar Desktop */}
      <div className="navbar-desktop" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <Link href="/" className="nes-btn">
            🏠 Home
          </Link>
          {user && (
            <>
              <Link href="/poesie" className="nes-btn">
                📜 Tutte
              </Link>
              <Link href="/mie-poesie" className="nes-btn">
                📚 Le mie
              </Link>
              <Link href="/nuova" className="nes-btn is-success">
                ✍️ Scrivi
              </Link>
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={toggleTheme} 
            className="nes-btn"
            title="Cambia tema"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          {user ? (
            <>
              <span className="user-greeting" style={{ color: textColor, whiteSpace: 'nowrap' }}>
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

      {/* Navbar Mobile */}
      <div className="navbar-mobile">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" className="nes-btn">
            🏠
          </Link>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={toggleTheme} 
              className="nes-btn"
              title="Cambia tema"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="nes-btn is-primary"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Menu mobile dropdown */}
        {menuOpen && (
          <div 
            className={theme === 'dark' ? 'nes-container is-dark' : 'nes-container'}
            style={{
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {user ? (
              <>
                <p style={{ color: textColor, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  Ciao, {user.user_metadata?.nome || user.email}!
                </p>
                <Link 
                  href="/poesie" 
                  className="nes-btn" 
                  style={{ width: '100%' }}
                  onClick={() => setMenuOpen(false)}
                >
                  📜 Tutte le poesie
                </Link>
                <Link 
                  href="/mie-poesie" 
                  className="nes-btn"
                  style={{ width: '100%' }}
                  onClick={() => setMenuOpen(false)}
                >
                  📚 Le mie poesie
                </Link>
                <Link 
                  href="/nuova" 
                  className="nes-btn is-success"
                  style={{ width: '100%' }}
                  onClick={() => setMenuOpen(false)}
                >
                  ✍️ Scrivi
                </Link>
                <button 
                  onClick={handleSignOut} 
                  className="nes-btn is-error"
                  style={{ width: '100%' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="nes-btn is-primary"
                style={{ width: '100%' }}
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}