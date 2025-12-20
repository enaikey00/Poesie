'use client'

import { useAuth } from './AuthContext'
import { useTheme } from './ThemeContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const { user, loading: authLoading } = useAuth()
  const { theme } = useTheme()
  const [poesie, setPoesie] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    fetchUltimePoesie()
  }, [])

  const fetchUltimePoesie = async () => {
    try {
      const { data, error } = await supabase
        .from('poesie')
        .select('*')
        .order('data_poesia', { ascending: false })
        .limit(5)

      if (error) throw error
      setPoesie(data || [])
    } catch (error) {
      console.error('Errore nel caricamento delle poesie:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return <div>Caricamento...</div>
  }

  const containerClass = theme === 'dark' 
    ? 'nes-container is-rounded is-dark' 
    : 'nes-container is-rounded'
  
  const textColor = theme === 'dark' ? '#fff' : '#212529'

  return (
    <main>
      <h1 style={{ color: textColor, textAlign: 'center' }}>Poesie Retrò 📜</h1>
      
      {/* Container di benvenuto */}
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

      {/* Sezione ultime poesie */}
      <div style={{marginTop: '3rem'}}>
        <h2 style={{ color: textColor, marginBottom: '1.5rem' }}>
          ✨ Ultime Poesie Pubblicate
        </h2>

        {loading ? (
          <div className={containerClass} style={{textAlign: 'center'}}>
            <p>Caricamento poesie...</p>
          </div>
        ) : poesie.length === 0 ? (
          <div className={containerClass} style={{textAlign: 'center'}}>
            <p>Nessuna poesia ancora pubblicata.</p>
            {user && (
              <Link href="/nuova" className="nes-btn is-success" style={{marginTop: '1rem'}}>
                ✍️ Sii il primo a pubblicare!
              </Link>
            )}
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {poesie.map((poesia) => {
                const CardContent = (
                  <div 
                    className={`${containerClass} poesia-card theme-${theme}`}
                    style={{
                      height: '100%',
                      cursor: user ? 'pointer' : 'not-allowed',
                      opacity: user ? 1 : 0.8,
                    }}
                  >
                    <h3 style={{marginBottom: '0.5rem'}}>
                      {poesia.titolo}
                    </h3>
                    
                    <p style={{fontSize: '0.7rem', opacity: 0.7, marginBottom: '1rem'}}>
                      di {poesia.autore}
                    </p>
                    
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
                      <span>{user ? '👁️ Leggi tutto' : '🔒 Login richiesto'}</span>
                    </div>
                  </div>
                )

                return user ? (
                  <Link 
                    key={poesia.id} 
                    href={`/poesie/${poesia.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    {CardContent}
                  </Link>
                ) : (
                  <div key={poesia.id}>
                    {CardContent}
                  </div>
                )
              })}
            </div>

            {/* Messaggio e bottone */}
            <div style={{marginTop: '2rem', textAlign: 'center'}}>
              {!user && (
                <p style={{ color: textColor, marginBottom: '1rem', fontSize: '0.9rem' }}>
                  🔐 Fai login per leggere le poesie complete e scoprirne altre!
                </p>
              )}

              <div style={{position: 'relative', display: 'inline-block'}}>
                {user ? (
                  <Link href="/poesie" className="nes-btn is-primary">
                    📜 Vedi tutte le poesie
                  </Link>
                ) : (
                  <>
                    <button 
                      className="nes-btn"
                      disabled
                      style={{cursor: 'not-allowed', opacity: 0.5}}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      📜 Vedi tutte le poesie
                    </button>
                    {showTooltip && (
                      <div 
                        className={theme === 'dark' ? 'nes-balloon from-left is-dark' : 'nes-balloon from-left'}
                        style={{
                          position: 'absolute',
                          bottom: '120%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          whiteSpace: 'nowrap',
                          fontSize: '0.7rem',
                          zIndex: 10
                        }}
                      >
                        <p>Devi fare login! 🔑</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}