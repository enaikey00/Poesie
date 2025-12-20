'use client'

import { useAuth } from './AuthContext'
import { useTheme } from './ThemeContext'
import Link from 'next/link'

export default function Home() {
  const { user, loading } = useAuth()
  const { theme } = useTheme()

  if (loading) {
    return <div>Caricamento...</div>
  }

  const containerClass = theme === 'dark' 
    ? 'nes-container is-rounded is-dark' 
    : 'nes-container is-rounded'
  
  const textColor = theme === 'dark' ? '#fff' : '#212529'

  return (
    <main>
      <h1 style={{ color: textColor, textAlign: 'center' }}>Poesie Retrò 📜</h1>
      <div className={containerClass} 
      style={{
        marginTop: '2rem',
        borderColor: theme === 'dark' ? '#2d3339' : 'whitesmoke',
        }}>
        <p>Benvenuto nel sito delle poesie in stile retrò!</p>
        <p style={{marginTop: '1rem'}}>
          {user 
            ? 'Qui potrai leggere e condividere le tue poesie.' 
            : 'Fai login per iniziare a condividere le tue poesie!'
          }
        </p>
        
        {!user && (
          <div style={{marginTop: '2rem'}}>
            <Link href="/login" className="nes-btn is-primary">
              Inizia ora!
            </Link>
          </div>
        )}
        
        {user && (
          <div style={{marginTop: '2rem'}}>
            <Link href="/nuova" className="nes-btn is-success">
              ✍️ Scrivi una poesia
            </Link>
            <Link href="/poesie" className="nes-btn" style={{marginLeft: '1rem'}}>
              📜 Vedi tutte le poesie
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}