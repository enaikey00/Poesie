'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '../ThemeContext'
import { useAuth } from '../AuthContext'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Ic
import CalendarIcon from '../components/CalendarIcon'
import EyeIcon from '../components/EyeIcon'
import BookIcon from '../components/BookIcon'
import MagicIcon from '../components/MagicIcon'

export default function Poesie() {
  const { theme } = useTheme()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [poesie, setPoesie] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Protezione: reindirizza al login se non autenticato
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchPoesie()
    }
  }, [user])

  const fetchPoesie = async () => {
    try {
      const { data, error } = await supabase
        .from('poesie')
        .select('*')
        .order('data_poesia', { ascending: false })

      if (error) throw error
      setPoesie(data || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Non mostrare niente mentre controlla l'autenticazione
  if (authLoading || !user) {
    return <div>Caricamento...</div>
  }

  const textColor = theme === 'dark' ? '#fff' : '#212529'
  const containerClass = theme === 'dark' 
    ? 'nes-container is-rounded is-dark' 
    : 'nes-container is-rounded'

  if (loading) {
    return (
      <main>
        <h1 style={{ color: textColor, textAlign: 'center' }}>  
          <BookIcon size={45} style={{ verticalAlign: 'top', marginRight: '1rem' }} /> 
          Tutte le Poesie
        </h1>        
      <div className={containerClass} style={{marginTop: '2rem', textAlign: 'center'}}>
          <p>Caricamento poesie...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1 style={{ color: textColor, textAlign: 'center' }}>  
          <BookIcon size={45} style={{ verticalAlign: 'top', marginRight: '1rem' }} /> 
          Tutte le Poesie
        </h1>        
      <div className="nes-container is-rounded is-error" style={{marginTop: '2rem'}}>
          <p>Errore: {error}</p>
        </div>
      </main>
    )
  }

  return (
    <main>
      <h1 style={{ color: textColor, textAlign: 'center' }}>
        <BookIcon size={45} style={{ verticalAlign: 'middle', marginRight: '1rem', marginBottom: '1rem'}} /> 
        Tutte le Poesie
      </h1>
      
      {poesie.length === 0 ? (
        <div className={containerClass} style={{marginTop: '2rem', textAlign: 'center'}}>
          <p>Nessuna poesia ancora pubblicata.</p>
          <p style={{marginTop: '1rem'}}>Sii il primo a condividere!</p>
          <Link href="/nuova" className="nes-btn is-success" style={{marginTop: '1rem'}}>
            <MagicIcon size={45}/>
            Scrivi la prima poesia
          </Link>
        </div>
      ) : (
        <div style={{marginTop: '2rem'}}>
          <p style={{ color: textColor, marginBottom: '1rem' }}>
            {poesie.length} {poesie.length === 1 ? 'poesia trovata' : 'poesie trovate'}
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
                    {poesia.titolo || ''}
                  </h3>
                  
                  <p style={{fontSize: '1rem', opacity: 0.7, marginBottom: '1rem'}}>
                    di <span style={{fontFamily: 'Borel'}} >{poesia.autore}</span>
                  </p>
                  
                  <p style={{
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    marginBottom: '1rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {poesia.contenuto}
                  </p>
                  
                  <div className="poesia-card-footer">
                    <span><CalendarIcon size={20} />  {poesia.data_poesia ? new Date(poesia.data_poesia).toLocaleDateString('it-IT') : '---'}</span>
                    <span><EyeIcon size={20} /> Leggi tutto</span>
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