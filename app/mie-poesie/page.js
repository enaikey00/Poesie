'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { useTheme } from '../ThemeContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function MiePoesie() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  const [poesie, setPoesie] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchMiePoesie()
  }, [user])

  const fetchMiePoesie = async () => {
    try {
      const { data, error } = await supabase
        .from('poesie')
        .select('*')
        .eq('user_id', user.id)
        .order('data_poesia', { ascending: false })

      if (error) throw error
      setPoesie(data || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const textColor = theme === 'dark' ? '#fff' : '#212529'
  const containerClass = theme === 'dark' 
    ? 'nes-container is-rounded is-dark' 
    : 'nes-container is-rounded'

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <main>
        <h1 style={{ color: textColor, textAlign: 'center' }}>📚 Le Mie Poesie</h1>
        <div className={containerClass} style={{marginTop: '2rem', textAlign: 'center'}}>
          <p>Caricamento...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1 style={{ color: textColor, textAlign: 'center' }}>📚 Le Mie Poesie</h1>
        <div className="nes-container is-rounded is-error" style={{marginTop: '2rem'}}>
          <p>Errore: {error}</p>
        </div>
      </main>
    )
  }

  return (
    <main>
      <h1 style={{ color: textColor, textAlign: 'center' }}>📚 Le Mie Poesie</h1>
      
      {poesie.length === 0 ? (
        <div className={containerClass} style={{marginTop: '2rem', textAlign: 'center'}}>
          <p>Non hai ancora scritto nessuna poesia.</p>
          <Link href="/nuova" className="nes-btn is-success" style={{marginTop: '1rem'}}>
            ✍️ Scrivi la tua prima poesia
          </Link>
        </div>
      ) : (
        <div style={{marginTop: '2rem'}}>
          <p style={{ color: textColor, marginBottom: '1rem' }}>
            Hai scritto {poesie.length} {poesie.length === 1 ? 'poesia' : 'poesie'}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {poesie.map((poesia) => (
              <Link 
                key={poesia.id} 
                href={`/poesie/${poesia.id}`}
                style={{ textDecoration: 'none' }}
              >
              <div 
                className={`${containerClass} poesia-card theme-${theme}`}
                style={{
                  height: '100%',
                  cursor: 'pointer',
                  borderColor: theme === 'dark' ? '#2d3339' : 'whitesmoke',
                }}
                >
                  <h3 style={{marginBottom: '0.5rem'}}>
                    {poesia.titolo}
                  </h3>
                  
                  <p style={{
                    fontSize: '0.8rem',
                    lineHeight: '1.6',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    marginBottom: '1rem'
                  }}>
                    {poesia.contenuto}
                  </p>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.6rem',
                    opacity: 0.6,
                    borderTop: '2px solid',
                    borderColor: theme === 'dark' ? '#fff' : '#212529',
                    paddingTop: '0.5rem'
                  }}>
                    <span>📅 {new Date(poesia.data_poesia).toLocaleDateString('it-IT')}</span>
                    <span>✏️ Modifica</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}